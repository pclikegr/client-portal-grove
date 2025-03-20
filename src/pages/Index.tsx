
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Users, Laptop, FileText } from 'lucide-react';

const Index: React.FC = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Διαχείριση Πελατών και Συσκευών
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Απλοποιήστε την διαχείριση των πελατών σας και των συσκευών τους με την εφαρμογή ClientBook.
          </p>
        </div>

        {session ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link to="/clients">
              <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Πελάτες</h2>
                <p className="text-muted-foreground mb-4">
                  Διαχειριστείτε τους πελάτες σας και δείτε το ιστορικό επισκευών τους.
                </p>
                <Button variant="outline" className="mt-auto">
                  Προβολή Πελατών <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            <Link to="/devices">
              <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center">
                <Laptop className="h-12 w-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Συσκευές</h2>
                <p className="text-muted-foreground mb-4">
                  Παρακολουθήστε τις συσκευές των πελατών σας και την κατάσταση επισκευής τους.
                </p>
                <Button variant="outline" className="mt-auto">
                  Προβολή Συσκευών <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            <Link to="/technical-reports">
              <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <h2 className="text-xl font-semibold mb-2">Τεχνικές Εκθέσεις</h2>
                <p className="text-muted-foreground mb-4">
                  Δημιουργήστε και διαχειριστείτε τις τεχνικές εκθέσεις σας.
                </p>
                <Button variant="outline" className="mt-auto">
                  Προβολή Εκθέσεων <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>
        ) : (
          <div className="mt-12 text-center">
            <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">Καλώς ορίσατε στο ClientBook</h2>
              <p className="text-muted-foreground mb-6">
                Συνδεθείτε για να διαχειριστείτε τους πελάτες και τις συσκευές σας.
              </p>
              <Link to="/auth">
                <Button size="lg" className="w-full">
                  Σύνδεση / Εγγραφή
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
