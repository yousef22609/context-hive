
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
          
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها أو حذفها.
          </p>
          
          <Link to="/" className="btn-primary inline-flex">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
