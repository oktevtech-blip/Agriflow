import { useState } from 'react';
import { Layout, type Page } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Farmers } from '@/pages/Farmers';
import { Production } from '@/pages/Production';
import { Orders } from '@/pages/Orders';
import { Logistics } from '@/pages/Logistics';
import { AIAssistant } from '@/pages/AIAssistant';
import { Buyers } from '@/pages/Buyers';

function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <Layout current={page} onNavigate={setPage}>
      {page === 'dashboard' && <Dashboard onNavigate={setPage} />}
      {page === 'farmers' && <Farmers />}
      {page === 'production' && <Production />}
      {page === 'buyers' && <Buyers />}
      {page === 'orders' && <Orders />}
      {page === 'logistics' && <Logistics />}
      {page === 'ai' && <AIAssistant />}
    </Layout>
  );
}

export default App;
