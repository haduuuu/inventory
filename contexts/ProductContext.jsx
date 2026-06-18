import { createContext, useState, useEffect } from 'react'
import { databases } from '../lib/appwrite'
import { ID, Permission, Role } from 'react-native-appwrite'
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
            const response = await databases.listDocuments(db_id, pd_id);
            setProducts(response.documents);
            return response.documents;
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
            console.log("Creating product with data:", productData);
            console.log("Database ID:", db_id, "Collection ID:", pd_id);
            console.log("User ID:", user.$id);

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
            console.log("Product created successfully:", newProduct);
            setProducts([...products, newProduct]);
            return newProduct;
        } catch (error) {
            console.error("Full error object:", error);
            console.error("Error message:", error.message);
            console.error("Error code:", error.code);
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
        <ProductContext.Provider value={{ products, fetchProducts, fetchProductsById, createProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    )
}