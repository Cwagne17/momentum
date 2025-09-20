import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';

function App() {
  // Test that ElectronAPI types are available
  const handleTestAPI = () => {
    if (window.electronAPI) {
      console.log('ElectronAPI is available and properly typed');
      // This will show TypeScript intellisense for the API methods
      window.electronAPI.getRecentPortfolios().then(portfolios => {
        console.log('Recent portfolios:', portfolios);
      });
    }
  };

  // Sample data for the chart demo
  const sampleData = [
    { month: 'Jan', netWorth: 50000 },
    { month: 'Feb', netWorth: 52000 },
    { month: 'Mar', netWorth: 48000 },
    { month: 'Apr', netWorth: 55000 },
    { month: 'May', netWorth: 58000 },
    { month: 'Jun', netWorth: 62000 },
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8">
        <Typography variant="h1" className="text-primary-600 mb-4">
          Momentum Net Worth Tracker
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-6">
          Welcome to your personal net worth tracking application! The UI
          frameworks are now configured and ready.
        </Typography>

        <Stack direction="row" spacing={2} className="mb-6">
          <Chip label="✅ Electron" color="success" />
          <Chip label="✅ React + TypeScript" color="success" />
          <Chip label="✅ Material-UI" color="success" />
          <Chip label="✅ Tailwind CSS" color="success" />
          <Chip label="✅ MUI X Charts" color="success" />
          <Chip label="✅ Zod Validation" color="success" />
        </Stack>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="card">
          <CardContent>
            <Typography variant="h5" className="mb-4">
              Framework Demo
            </Typography>
            <Typography variant="body2" className="mb-4 text-gray-600">
              This demonstrates the integration of MUI components with Tailwind
              CSS styling.
            </Typography>
            <Button
              variant="contained"
              onClick={handleTestAPI}
              className="btn-primary"
            >
              Test ElectronAPI Types
            </Button>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent>
            <Typography variant="h5" className="mb-4">
              Chart Demo
            </Typography>
            <Typography variant="body2" className="mb-4 text-gray-600">
              Sample chart using MUI X Charts - ready for net worth
              visualization.
            </Typography>
            <Box className="h-48">
              <LineChart
                width={300}
                height={180}
                series={[
                  {
                    data: sampleData.map(d => d.netWorth),
                    label: 'Net Worth',
                    color: '#0ea5e9',
                  },
                ]}
                xAxis={[
                  {
                    scaleType: 'point',
                    data: sampleData.map(d => d.month),
                  },
                ]}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card className="card">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Next Steps
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            The UI framework setup is complete! Next tasks will implement:
          </Typography>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Core data models and validation schemas</li>
            <li>• File system operations and portfolio management</li>
            <li>• IPC communication layer</li>
            <li>• Data service for portfolio management</li>
            <li>• Calculation engine for net worth metrics</li>
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
