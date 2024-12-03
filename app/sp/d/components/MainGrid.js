import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import StatCard from './StatCard';
import ReturnReport from '@/app/components/ReturnReport';
import OrderReport from '@/app/components/OrderReport';


export default function MainGrid({ count, companies }) {
  const received = count["return received"] || 0
  const shelfRequested = count["return shelf requested"] || 0
  const shelved = count["return shelved"] || 0
  const shipRequested = count["return ship requested"] || 0
  const shipped = count["return shipped"] || 0
  const delivered = count["return delivered"] || 0
  const totalReturns = received + shelfRequested + shelved + shipRequested + shipped + delivered
  const orderCancelled = count["order cancelled'"] || 0
  const orderReceived = count["order received"] || 0
  const orderShipped = count["order shipped"] || 0
  const totalOrders = orderCancelled + orderReceived + orderShipped

  const data = [
    {
      title: 'Total Returns',
      value: totalReturns,
      interval: 'Click to See Details',
      trend: 'up',
      link: '/sp/d/returns',
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
        360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
      ],
    },
    {
      title: 'Received Returns',
      value: received,
      interval: 'Click to See Details',
      trend: 'down',
      link: '/sp/d/returns?status=Received',
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
        780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
      ],
    },
    {
      title: 'Ship Request Returns',
      value: shipRequested,
      interval: 'Click to See Details',
      trend: 'neutral',
      link: '/sp/d/returns?status=Ship Requested',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
    {
      title: 'Shipped Returns',
      value: shipped,
      interval: 'Click to See Details',
      trend: 'neutral',
      link: '/sp/d/returns?status=shipped',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      interval: 'Click to See Details',
      trend: 'up',
      link: '/sp/d/orders',
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
        360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
      ],
    },
    {
      title: 'Received Orders',
      value: orderReceived,
      interval: 'Click to See Details',
      trend: 'down',
      link: '/sp/d/orders?status=Received',
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
        780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
      ],
    },
    {
      title: 'Cancelled Orders',
      value: orderCancelled,
      interval: 'Click to See Details',
      trend: 'neutral',
      link: '/sp/d/orders?status=Cancelled',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
    {
      title: 'Shipped Orders',
      value: orderShipped,
      interval: 'Click to See Details',
      trend: 'neutral',
      link: '/sp/d/orders?status=Shipped',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
  ]

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ sm: 12, md: 6 }}>
          <ReturnReport />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <OrderReport />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
