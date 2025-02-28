
import React from 'react';
import { Info, Phone, User } from 'lucide-react';

const DeveloperInfoDialog: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <button 
        onClick={openDialog}
        className="text-primary hover:underline flex items-center justify-center mx-auto"
      >
        <Info className="h-4 w-4 mr-1" />
        معلومات المطور
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-auto animate-scale-in">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              معلومات المطور
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-bold mb-2">الاسم</h3>
                <p>يوسف هشام شعبان</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-bold mb-2">رقم الواتساب</h3>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  <a 
                    href="https://wa.me/01007570190" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    dir="ltr"
                  >
                    01007570190
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={closeDialog}
                className="btn-primary"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperInfoDialog;
