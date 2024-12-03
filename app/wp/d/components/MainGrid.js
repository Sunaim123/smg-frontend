"use client"
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Copyright from '../internals/components/Copyright'
import StatCard from './StatCard'
import ReturnReport from '@/app/components/ReturnReport'
import FbaReport from '@/app/components/FbaReport'
import DashboardReport from './DashboardReports'
import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'


export default function MainGrid(props) {
  const { count, setToast, companies, company_ids, handleChange } = props
  const userState = useSelector(state => state.user)

  const received = count["return received"] || 0
  const shelfRequested = count["return shelf requested"] || 0
  const shelved = count["return shelved"] || 0
  const shipRequested = count["return ship requested"] || 0
  const shipped = count["return shipped"] || 0
  const delivered = count["return delivered"] || 0
  const fbaPending = count["fba pending"] || 0
  const fbaReceived = count["fba received"] || 0
  const fbaShipped = count["fba shipped"] || 0
  const totalReturns = received + shelfRequested + shelved + shipRequested + shipped + delivered
  const totalFbas = fbaPending + fbaReceived + fbaShipped

  const data = [
    {
      title: 'Total Returns',
      value: totalReturns,
      interval: 'Click to See Details',
      trend: 'up',
      link: '/wp/d/returns',
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
      link: '/wp/d/returns?status=Received',
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
      link: '/wp/d/returns?status=Ship Requested',
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
      link: '/wp/d/returns?status=shipped',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
    {
      title: 'Total Fulfillments',
      value: totalFbas,
      interval: 'Click to See Details',
      trend: 'up',
      link: '/wp/d/fbas',
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
        360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
      ],
    },
    {
      title: 'Pending Fulfillments',
      value: fbaPending,
      interval: 'Click to See Details',
      trend: 'down',
      link: '/wp/d/fbas?status=Pending',
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
        780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
      ],
    },
    {
      title: 'Received Fulfillments',
      value: fbaReceived,
      interval: 'Click to See Details',
      trend: 'neutral',
      link: '/wp/d/fbas?status=Received',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
    {
      title: 'Shipped Fulfillments',
      value: fbaShipped,
      interval: 'Click to See Details',
      trend: 'neutral',
      link: '/wp/d/fbas?status=Shipped',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
  ]



  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Grid container>
        <Grid size={{ sm: 9, md: 9 }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Overview
          </Typography>
        </Grid>

        {userState.warehouseUser &&
          <Grid size={{ sm: 3, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-multiple-chip-label">Companies</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={company_ids}
                size="small"
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Companies" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const company = companies.find((c) => c.id === id)
                      return <Chip key={id} label={company?.name} />
                    })}
                  </Box>
                )}
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>}
      </Grid>
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
          <ReturnReport company_ids={company_ids} />
        </Grid>
        <Grid size={{ sm: 12, md: 6 }}>
          <FbaReport company_ids={company_ids} />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ md: 12, lg: 12 }}>
          <DashboardReport setToast={setToast} company_ids={company_ids} />
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  )
}
