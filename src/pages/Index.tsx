
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getClients } from '@/data/clients';
import { Users, UserPlus, Search, BarChart } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const clients = getClients();
  
  return (
    <div className="min-h-screen pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-12 pt-8 animate-slide-down">
          <h1 className="text-4xl font-bold mb-3">Καλώς ήρθατε στο ClientBook</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Η εφαρμογή διαχείρισης πελατών που σας βοηθά να οργανώσετε και να παρακολουθείτε τους πελάτες σας με λεπτομέρεια.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 flex flex-col items-center text-center glass-card card-hover-effect animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium mb-2">Πελάτες</h2>
            <p className="text-muted-foreground mb-4">Διαχειριστείτε τους πελάτες σας και δείτε τα στοιχεία τους.</p>
            <Button 
              onClick={() => navigate('/clients')} 
              variant="outline" 
              className="mt-auto btn-hover-effect"
            >
              Προβολή πελατών
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center glass-card card-hover-effect animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium mb-2">Νέος Πελάτης</h2>
            <p className="text-muted-foreground mb-4">Προσθέστε έναν νέο πελάτη στο σύστημα.</p>
            <Button 
              onClick={() => navigate('/clients/add')} 
              variant="default" 
              className="mt-auto btn-hover-effect"
            >
              Προσθήκη πελάτη
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center glass-card card-hover-effect animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium mb-2">Αναζήτηση</h2>
            <p className="text-muted-foreground mb-4">Αναζητήστε πελάτες με βάση διάφορα κριτήρια.</p>
            <Button 
              onClick={() => navigate('/clients')} 
              variant="outline" 
              className="mt-auto btn-hover-effect"
            >
              Αναζήτηση
            </Button>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center glass-card card-hover-effect animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium mb-2">Στατιστικά</h2>
            <p className="text-muted-foreground mb-4">Προβολή στατιστικών και αναφορών.</p>
            <Button 
              variant="outline" 
              className="mt-auto btn-hover-effect opacity-70 cursor-not-allowed"
              disabled
            >
              Σύντομα διαθέσιμο
            </Button>
          </Card>
        </div>
        
        <div className="mb-12">
          <div className="bg-primary/5 rounded-lg p-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Διαχειριστείτε {clients.length} πελάτες</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Το ClientBook σας βοηθά να διατηρείτε οργανωμένα τα στοιχεία των πελατών σας και να έχετε πρόσβαση σε αυτά από οπουδήποτε.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => navigate('/clients')} className="btn-hover-effect">
                Προβολή όλων των πελατών
              </Button>
              <Button onClick={() => navigate('/clients/add')} variant="outline" className="btn-hover-effect">
                Προσθήκη νέου πελάτη
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
