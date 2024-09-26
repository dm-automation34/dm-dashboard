import { useState } from 'react'

import {
  Grid,
  Box,
  Card,
  Typography,
  Divider,
  alpha,
  styled,
  useTheme
} from '@mui/material'

import { useTranslation } from 'react-i18next'
import GaugeChart from 'react-gauge-chart'

const CardWrapper = styled(Card)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['box-shadow'])};
    position: relative;
    z-index: 5;

    &:hover {
        z-index: 6;
        box-shadow: 
            0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
            0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
            0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
            0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
    }
  `
)

export const StatisticChart = ({ screen, percent, subTitle }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [currentPercent1, setCurrentPercent1] = useState(
    Math.round(percent) || 0
  )

  return (
    <Grid
      container
      spacing={4}
      justifyContent={'center'}
      alignContent={'center'}
      mb={2}
    >
      <Grid item>
        <CardWrapper
          sx={{
            p: 3
          }}
        >
          <Box
            pb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(16)}`
              }}
              variant="h3"
            >
              {screen.slideHeader}
            </Typography>
          </Box>
          <Box
            sx={{
              mx: 'auto',
              maxWidth: '340px'
            }}
          >
            <GaugeChart
              arcPadding={0.1}
              cornerRadius={3}
              textColor={theme.colors.alpha.black[70]}
              needleColor={theme.colors.alpha.black[50]}
              needleBaseColor={theme.colors.alpha.black[100]}
              colors={[theme.colors.success.lighter, theme.colors.success.main]}
              percent={currentPercent1 / 100}
              animDelay={0}
            />
          </Box>
          <Divider />
          <Typography variant="subtitle2">{subTitle}</Typography>
        </CardWrapper>
      </Grid>
    </Grid>
  )
}
