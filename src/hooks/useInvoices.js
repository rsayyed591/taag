import {
    addDoc,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase.config';
import { useAuth } from '../context/AuthContext';

export function useInvoices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Create new invoice
  const createInvoice = async (invoiceData) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    try {
      let signatureURL = null;
      
      // If there's a signature file, upload it
      if (invoiceData.signature instanceof File) {
        signatureURL = await uploadSignature(invoiceData.signature);
      }

      const invoiceRef = await addDoc(collection(db, 'invoices'), {
        ...invoiceData,
        signature: signatureURL, // Store the URL instead of the file
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { id: invoiceRef.id, ...invoiceData, signature: signatureURL };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing invoice
  const updateInvoice = async (invoiceId, invoiceData) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);
    try {
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, {
        ...invoiceData,
        updatedAt: new Date().toISOString()
      });
      return { id: invoiceId, ...invoiceData };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete invoice
  const deleteInvoice = async (invoiceId) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all invoices for current user
  const getInvoices = async () => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);
    try {
      // Create a simple query first
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')  // This combination needs an index
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      // If the error contains an indexing URL, log it
      if (err.code === 'failed-precondition') {
        console.log('Please create the following index:', err.message);
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single invoice by ID
  const getInvoiceById = async (invoiceId) => {
    if (!user) throw new Error('User not authenticated');
    if (!invoiceId) throw new Error('Invoice ID is required');

    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'invoices', invoiceId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Verify that this invoice belongs to the current user
        if (data.userId === user.uid) {
          return { id: docSnap.id, ...data };
        }
        throw new Error('Invoice not found');
      }
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add payment to invoice
  const addPayment = async (invoiceId, paymentDetails) => {
    setLoading(true);
    setError(null);
    try {
      const invoiceRef = doc(db, 'invoices', invoiceId);
      await updateDoc(invoiceRef, {
        'amountDetails.receivedPayments': arrayUnion(paymentDetails),
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forward invoice to chats
  const forwardInvoiceToChats = async (invoiceId, chatIds) => {
    setLoading(true);
    setError(null);
    try {
      const batch = writeBatch(db);
      
      chatIds.forEach(chatId => {
        const messageRef = doc(collection(db, 'chats', chatId, 'messages'));
        batch.set(messageRef, {
          type: 'invoice',
          invoiceId,
          senderId: user.uid,
          timestamp: new Date().toISOString()
        });
      });

      await batch.commit();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add this new function to handle signature upload
  const uploadSignature = async (signatureFile) => {
    if (!user) throw new Error('User not authenticated');
    if (!signatureFile) throw new Error('No signature file provided');

    try {
      // Check file size (2MB limit)
      const TWO_MB = 2 * 1024 * 1024; // 2MB in bytes
      if (signatureFile.size > TWO_MB) {
        throw new Error('Signature file size must be less than 2MB');
      }

      // Get file extension
      const fileExtension = signatureFile.name.split('.').pop().toLowerCase();
      if (!['png', 'jpg', 'jpeg'].includes(fileExtension)) {
        throw new Error('Only PNG and JPG files are allowed');
      }

      const storage = getStorage();
      const signatureRef = ref(storage, `signatures/${user.uid}/${uuidv4()}.${fileExtension}`);
      
      await uploadBytes(signatureRef, signatureFile);
      const downloadURL = await getDownloadURL(signatureRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading signature:', error);
      throw error;
    }
  };

  return {
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoices,
    getInvoiceById,
    addPayment,
    forwardInvoiceToChats,
    uploadSignature,
  };
} 