import { collection, getDocs, query, limit, startAfter, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const fetchProducts = async (limitNum, skip) => {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('id'), limit(limitNum));

    if (skip > 0) {
      // For proper pagination, we need to keep track of the last document
      // For now, fetch all and slice (not efficient for large datasets)
      const allDocs = await getDocs(query(productsRef, orderBy('id')));
      const docs = allDocs.docs.slice(skip, skip + limitNum);
      const products = docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      return { products };
    } else {
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
      return { products };
    }
  } catch (error) {
    console.error('Firebase error:', error);
    // Return empty array instead of throwing to prevent crashes
    return { products: [] };
  }
};
