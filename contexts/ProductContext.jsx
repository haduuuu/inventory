import { createContext, useState, useContext } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Fetch logic here
            setProducts([]);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = (product) => {
        setProducts([...products, product]);
    };

    const updateProduct = (id, updatedProduct) => {
        setProducts(products.map(p => p.id === id ? updatedProduct : p));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                setProducts,
                loading,
                error,
                fetchProducts,
                addProduct,
                updateProduct,
                deleteProduct
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductProvider');
    }
    return context;
};
