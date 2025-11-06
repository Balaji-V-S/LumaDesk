// src/pages/IssueCategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllIssueCategories, deleteIssueCategory } from '../api/categoryService';
import { Button } from '../components/ui/Button';
import { Loader2, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import IssueCategoryFormModal from '../components/admin/IssueCategoryFormModal'; // We'll create this next

const IssueCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null); // null = create

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getAllIssueCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load issue categories.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setCurrentCategory(null); // Set to null for "Create" mode
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category); // Pass the category object for "Edit" mode
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const promise = deleteIssueCategory(categoryId)
        .then(() => {
          setCategories(prev => prev.filter(c => c.categoryId !== categoryId));
          return "Category deleted successfully";
        });

      toast.promise(promise, {
        loading: 'Deleting category...',
        success: (message) => message,
        error: 'Failed to delete category.',
      });
    }
  };
  
  const handleSaveSuccess = () => {
    fetchCategories(); // Refetch the list from the server
    setIsModalOpen(false); // Close the modal
  };

  if (isLoading) { /* ... (loading spinner) ... */ }
  if (error) { /* ... (error message) ... */ }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-stone-800">Issue Categories</h1>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create New Category
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Category ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-stone-500">Category Name</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td className="px-6 py-4 text-sm font-medium text-stone-800">#{category.categoryId}</td>
                <td className="px-6 py-4 text-sm text-stone-500">{category.categoryName}</td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600" onClick={() => handleDelete(category.categoryId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <IssueCategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSuccess}
        category={currentCategory}
      />
    </motion.div>
  );
};

export default IssueCategoryPage;