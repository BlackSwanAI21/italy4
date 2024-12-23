import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '../Button';
import { useTheme } from '../../lib/theme-context';
import { useAuth } from '../../lib/auth-context';
import { db_operations } from '../../lib/db';

export function LogoUploader() {
  const { user, login: updateUser } = useAuth();
  const { customColors, setCustomColors } = useTheme();
  const [isUploading, setIsUploading] = useState(false);

  // Load saved logo on mount
  useEffect(() => {
    if (user?.logo) {
      setCustomColors(prev => ({
        ...prev,
        logo: user.logo
      }));
    }
  }, [user?.logo]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      const logoData = reader.result as string;
      
      try {
        // Update database
        const updatedUser = await db_operations.updateUser(user.id, {
          logo: logoData
        });

        // Update auth context
        if (updatedUser) {
          updateUser({
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            logo: updatedUser.logo
          });
        }

        // Update theme context
        setCustomColors(prev => ({
          ...prev,
          logo: logoData
        }));
      } catch (error) {
        console.error('Failed to save logo:', error);
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const removeLogo = async () => {
    if (!user) return;

    try {
      // Update database
      const updatedUser = await db_operations.updateUser(user.id, {
        logo: null
      });

      // Update auth context
      if (updatedUser) {
        updateUser({
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          logo: null
        });
      }

      // Update theme context
      setCustomColors(prev => ({
        ...prev,
        logo: undefined
      }));
    } catch (error) {
      console.error('Failed to remove logo:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Company Logo</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload your company logo to replace the default text
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 h-12 w-48 relative">
          {customColors.logo ? (
            <div className="relative group">
              <img
                src={customColors.logo}
                alt="Company logo"
                className="h-12 object-contain"
              />
              <button
                onClick={removeLogo}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="h-12 w-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500">No logo uploaded</span>
            </div>
          )}
        </div>

        <div>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
          />
          <Button
            type="button"
            onClick={() => document.getElementById('logo-upload')?.click()}
            isLoading={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Logo
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Recommended: PNG or SVG with transparent background, maximum size 1MB
      </p>
    </div>
  );
}