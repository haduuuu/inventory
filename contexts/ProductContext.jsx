import { createContext, useState, useEffect } from 'react'
import { databases } from '../lib/appwrite'
import { ID, Permission, Role, Query } from 'react-native-appwrite'
import { useUser } from '../hooks/useUser'
const db_id = "6a0d9d24002f754b3e72"
const pd_id = "products"

export const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([])

    async function fetchProducts() {
        try {
            if (!databases) {
                return;
            }
            // Appwrite caps each listDocuments call at 25 results by default —
            // this loops through pages so `products` always has your FULL inventory,
            // not just the first 25. That matters a lot now that barcode scanning
            // relies on finding matches in this local list.
            let allDocuments = [];
            let lastId = null;
            const pageSize = 100;

            while (true) {
                const queries = [Query.limit(pageSize)];
                if (lastId) {
                    queries.push(Query.cursorAfter(lastId));
                }
                const response = await databases.listDocuments(db_id, pd_id, queries);
                allDocuments = allDocuments.concat(response.documents);

                if (response.documents.length < pageSize) break;
                lastId = response.documents[response.documents.length - 1].$id;
            }

            setProducts(allDocuments);
            return allDocuments;
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    async function fetchProductsById(productId) {
        try {
            if (!databases) {
                throw new Error("Databases not initialized");
            }
            const response = await databases.getDocument(db_id, pd_id, productId);
            return response;
        } catch (error) {
            console.error("Error fetching products by ID:", error)
        }
    }

    async function createProduct(productData, user) {
        try {
            if (!user) {
                throw new Error("You must be logged in to create products. Please log in first.");
            }

            const permissions = [
                Permission.read(Role.any()),
                Permission.write(Role.user(user.$id)),
                Permission.update(Role.user(user.$id)),
                Permission.delete(Role.user(user.$id))
            ];

            const newProduct = await databases.createDocument(
                db_id,
                pd_id,
                ID.unique(),
                productData,
                permissions
            );
            setProducts([...products, newProduct]);
            return newProduct;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    // 👇 New: updates an existing product's fields and syncs local state
    async function updateProduct(productId, productData) {
        try {
            if (!databases) {
                throw new Error("Databases not initialized");
            }
            const updated = await databases.updateDocument(
                db_id,
                pd_id,
                productId,
                productData
            );
            setProducts((prev) =>
                prev.map((p) => (p.$id === productId ? updated : p))
            );
            return updated;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    }

    async function deleteProduct(productId) {
        try {
            if (!databases) {
                throw new Error("Databases not initialized");
            }
            await databases.deleteDocument(db_id, pd_id, productId);
            setProducts(products.filter(p => p.$id !== productId));
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    }

    return (
        <ProductContext.Provider value={{ products, fetchProducts, fetchProductsById, createProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    )
}
