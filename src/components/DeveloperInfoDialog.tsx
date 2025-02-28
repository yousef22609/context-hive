
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle, Phone, User, Mail } from 'lucide-react';

interface DeveloperInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeveloperInfoDialog: React.FC<DeveloperInfoDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">معلومات المطور</DialogTitle>
          <DialogDescription className="text-center">
            معلومات التواصل مع مطور التطبيق
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center mt-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          
          <h2 className="text-xl font-bold mb-1">يوسف هشام شعبان</h2>
          <p className="text-muted-foreground mb-6">مطور تطبيقات ويب</p>
          
          <div className="space-y-4 w-full">
            <a 
              href="https://wa.me/01007570190" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-accent transition-colors w-full"
            >
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">واتساب</p>
                <p className="text-sm text-muted-foreground">01007570190</p>
              </div>
            </a>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card w-full">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">رقم الهاتف</p>
                <p className="text-sm text-muted-foreground">01007570190</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card w-full">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">البريد الإلكتروني</p>
                <p className="text-sm text-muted-foreground">dev.youssef@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperInfoDialog;
