import { collection, getDocs, query, orderBy, limit, startAfter, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetches products from Firestore with optional pagination and category filtering
 * @param {number} limitNum - Number of products to fetch (default: 15)
 * @param {Object} lastDoc - Last document reference for pagination
 * @param {string} category - Category filter ('All' for no filter)
 * @returns {Promise<Object>} Object containing products array and lastDoc reference
 */
export const fetchProducts = async (limitNum = null, lastDoc = null, category = 'All') => {
  try {
    // Reference to products collection
    const productsRef = collection(db, 'products');
    let q = query(productsRef);
    // Apply category filter if specified
    if (category !== 'All') {
      q = query(q, where('category', '==', category));
    }
    // Order by id for consistent pagination
    q = query(q, orderBy('id'));
    // Apply pagination or initial limit
    if (lastDoc) {
      q = query(q, startAfter(lastDoc), limit(limitNum || 15));
    } else {
      q = query(q, limit(limitNum || 15));
    }
    const querySnapshot = await getDocs(q);
    // Map documents to product objects with docId
    const products = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
    // Get last document for next pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { products, lastDoc: lastVisible };
  } catch (error) {
    console.error('Firebase error:', error);
    // Return empty array instead of throwing to prevent crashes
    return { products: [], lastDoc: null };
  }
};

/**
 * Sets up real-time listener for products collection
 * Triggers callback when new products are added
 * @param {Function} onNewProduct - Callback function when new product is added
 * @returns {Function} Unsubscribe function to stop listening
 */
export const subscribeToNewProducts = (onNewProduct) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('id'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // Trigger callback only for newly added documents
        if (change.type === 'added') {
          const newProduct = {
            docId: change.doc.id,
            ...change.doc.data()
          };
          onNewProduct(newProduct);
        }
      });
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    return () => {}; // Return no-op unsubscribe
  }
};
