// src/pages/SlaPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllSlas, deleteSla } from '../api/slaService';
import { Button } from '../components/ui/Button';
import { Loader2, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import SlaFormModal from '../components/admin/SlaFormModal'; // We'll create this next

const SlaPage = () => {
  const [slas, setSlas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSla, setCurrentSla] = useState(null); // 'null' for create, SLA object for edit

  const fetchSlas = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSlas();
      setSlas(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load SLAs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlas();
  }, []);

  const handleCreate = () => {
    setCurrentSla(null); // Set to null for "Create" mode
    setIsModalOpen(true);
  };

  const handleEdit = (sla) => {
    setCurrentSla(sla); // Pass the SLA object for "Edit" mode
    setIsModalOpen(true);
  };

  const handleDelete = (slaId) => {
    if (window.confirm('Are you sure you want to delete this SLA? This action cannot be undone.')) {
      const promise = deleteSla(slaId)
        .then(() => {
          // Refresh list by filtering out the deleted item
          setSlas(prev => prev.filter(s => s.slaId !== slaId));
          return "SLA deleted successfully";
        });

      toast.promise(promise, {
        loading: 'Deleting SLA...',
        success: (message) => message,
        error: 'Failed to delete SLA.',
      });
    }
  };
  
  const handleSaveSuccess = () => {
    fetchSlas(); // Refetch the list from the server
    setIsModalOpen(false); // Close the modal
  };

  if (isLoading) { /* ... (loading spinner) ... */ }
  if (error) { /* ... (error message) ... */ }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-stone-800">SLA Management</h1>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create New SLA
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">SLA ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Time Limit (Hours)</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {slas.map((sla) => (
              <tr key={sla.slaId}>
                <td className="px-6 py-4 text-sm font-medium text-stone-800">#{sla.slaId}</td>
                <td className="px-6 py-4 text-sm text-stone-500">{sla.severity}</td>
                <td className="px-6 py-4 text-sm text-stone-500">{sla.priority}</td>
                <td className="px-6 py-4 text-sm text-stone-500">{sla.timeLimitHour}h</td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(sla)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600" onClick={() => handleDelete(sla.slaId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSuccess}
        sla={currentSla}
      />
    </motion.div>
  );
};

export default SlaPage;