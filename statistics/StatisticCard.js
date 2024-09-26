import { Box, Stack, Card, Typography, Divider } from '@mui/material'

import { useTranslation } from 'react-i18next'

export const StatisticCard = ({
  actualSpeed,
  workingSpeed,
  productionSpeed
}) => {
  const { t } = useTranslation()

  return (
    <Card>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={0}
      >
        <Box
          p={2}
          sx={{
            textAlign: 'center'
          }}
        >
          {/* <Text color="warning">
                        <MonetizationOnTwoToneIcon fontSize="large" />
                    </Text> */}

          <Typography variant="h3">{actualSpeed}</Typography>
          <Typography variant="subtitle2">{t('Actual Speed')}</Typography>
        </Box>
        <Box
          p={2}
          sx={{
            textAlign: 'center'
          }}
        >
          {/* <Text color="success">
                        <PersonTwoToneIcon fontSize="large" />
                    </Text> */}

          <Typography variant="h3">{workingSpeed}</Typography>
          <Typography variant="subtitle2">{t('Working Speed')}</Typography>
        </Box>
        <Box
          p={2}
          sx={{
            textAlign: 'center'
          }}
        >
          {/* <Text color="info">
                        <SubscriptionsTwoToneIcon fontSize="large" />
                    </Text> */}
          <Typography variant="h3">{productionSpeed}</Typography>
          <Typography variant="subtitle2">{t('Production Speed')}</Typography>
        </Box>
      </Stack>
    </Card>
  )
}
