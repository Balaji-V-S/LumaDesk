// src/pages/FeedbackPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFeedbackRequests, submitFeedback } from '../api/feedbackService';
import {
  Loader2,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  X,
  History,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { motion } from 'framer-motion';

// --- Feedback Form (in a Modal) ---
const FeedbackFormModal = ({ request, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError('Please select a rating from 1 to 5 stars.');
      return;
    }
    
    setIsSubmitting(true);
    
    // --- THIS IS THE DTO FIX ---
    // Sending ticketId, as you requested.
    const feedbackData = {
      ticketId: request.ticketId, // Use ticketId from the request
      rating: parseFloat(rating),
      comment,
    };
    // --- END FIX ---

    try {
      await submitFeedback(feedbackData);
      onSuccess(); // This will trigger the success message on the main page
      onClose(); // Close the modal
    } catch (err) {
      console.error(err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
        <Dialog.Title className="text-xl font-semibold text-stone-800">
          Submit Feedback
        </Dialog.Title>
        <Dialog.Description className="mt-1 text-sm text-stone-600">
          How was your experience with Ticket #{request.ticketId}?
        </Dialog.Description>
        
        <Form.Root onSubmit={handleSubmit} className="mt-6 space-y-6">
          <Form.Field name="rating" className="flex flex-col items-center">
            <Form.Label className="mb-3 text-sm font-medium text-stone-700">
              Your Rating
            </Form.Label>
            <Form.Control asChild>
              <StarRating rating={rating} setRating={setRating} />
            </Form.Control>
          </Form.Field>

          <Form.Field name="comment">
            <Form.Label className="mb-2 block text-sm font-medium text-stone-700">
              Comments (Optional)
            </Form.Label>
            <Form.Control asChild>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="block w-full rounded-md border-stone-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                placeholder="Tell us what you think..."
              />
            </Form.Control>
          </Form.Field>
          
          {error && (
            <p className="flex items-center text-sm text-rose-500">
              <AlertCircle className="mr-2 h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <Dialog.Close asChild>
              <Button variant="ghost">Cancel</Button>
            </Dialog.Close>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit'}
            </Button>
          </div>
        </Form.Root>

        <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-stone-500 hover:bg-stone-100">
          <X className="h-5 w-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
};


// --- Main Feedback Page ---
const FeedbackPage = () => {
  const { user } = useAuth();
  // --- STATE UPDATE: Split into two lists ---
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  // ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchData = async () => {
    if (!user?.userId) return;
    try {
      setIsLoading(true);
      const response = await getFeedbackRequests(user.userId);
      
      // --- LOGIC UPDATE: Filter data on arrival ---
      const allFeedback = response.data || [];
      setPendingRequests(allFeedback.filter(r => r.feedbackStatus === 'PENDING'));
      setCompletedRequests(allFeedback.filter(r => r.feedbackStatus === 'COMPLETED'));
      // ---
      
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load your feedback requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSuccess = () => {
    setSuccess('Thank you! Your feedback has been submitted.');
    // Re-fetch data to move the item from 'pending' to 'completed'
    fetchData();
    setTimeout(() => setSuccess(null), 5000);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <Dialog.Root
      open={!!selectedRequest}
      onOpenChange={(open) => !open && setSelectedRequest(null)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-6 text-3xl font-bold text-stone-800">
          My Feedbacks
        </h1>
        
        {error}
        {success}

        {/* --- UI UPDATE: Pending List --- */}
        <h2 className="mb-4 text-xl font-semibold text-stone-700">
          Pending Requests
        </h2>
        <div className="mb-8 rounded-lg bg-white shadow-sm">
          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <MessageSquare className="mx-auto h-12 w-12" />
              <p className="mt-4 font-medium">No pending feedback requests</p>
              <p className="mt-1 text-sm">You're all caught up!</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {pendingRequests.map((req) => (
                <li
                  key={req.feedbackId} // Assuming feedbackId is the unique key
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-stone-800">
                      Feedback for Ticket #{req.ticketId}
                    </p>
                    <p className="text-sm text-stone-500">
                      {req.description || 'Service completed.'}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setSelectedRequest(req)}
                  >
                    Give Feedback
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- UI UPDATE: Completed List --- */}
        <h2 className="mb-4 text-xl font-semibold text-stone-700">
          Completed Feedback
        </h2>
        <div className="rounded-lg bg-white shadow-sm">
          {completedRequests.length === 0 ? (
            <div className="p-12 text-center text-stone-500">
              <History className="mx-auto h-12 w-12" />
              <p className="mt-4 font-medium">No completed feedback yet</p>
              <p className="mt-1 text-sm">Your past feedback will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {completedRequests.map((req) => (
                <li
                  key={req.feedbackId}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-stone-800">
                      Ticket #{req.ticketId}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {req.comment || 'No comment left.'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-amber-600">
                      {req.rating}
                    </span>
                    <Star className="h-5 w-5 text-amber-500" fill="currentColor" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* The Modal itself, which renders when `selectedRequest` is not null */}
        {selectedRequest && (
          <FeedbackFormModal
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            onSuccess={handleSuccess}
          />
        )}
      </motion.div>
    </Dialog.Root>
  );
};

export default FeedbackPage;