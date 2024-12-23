import React from 'react';
import { Dialog } from '../Dialog';
import { Button } from '../Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteAgentDialogProps {
  agentName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteFromOpenAI: boolean) => Promise<void>;
}

export function DeleteAgentDialog({ 
  agentName, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteAgentDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDelete = async (deleteFromOpenAI: boolean) => {
    setIsLoading(true);
    try {
      await onConfirm(deleteFromOpenAI);
      onClose();
    } catch (error) {
      console.error('Failed to delete agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Delete AI Agent">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-yellow-600">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="text-lg font-medium">Are you sure?</h3>
        </div>

        <p className="text-sm text-gray-500">
          You are about to delete <span className="font-medium text-gray-900">{agentName}</span>.
          This action cannot be undone.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-4">
            Would you also like to delete this agent from your OpenAI account?
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => handleDelete(true)}
              isLoading={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, delete from both
            </Button>
            <Button
              onClick={() => handleDelete(false)}
              variant="secondary"
              disabled={isLoading}
            >
              No, only delete from app
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
}