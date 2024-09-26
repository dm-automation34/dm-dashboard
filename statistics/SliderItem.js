import { Box, Grid, Typography } from '@mui/material'
import 'swiper/css'
import useScreenDimensions from 'src/hooks/useScreenDimensions'

export const SliderItem = ({ screen, border }) => {
  const { width, height } = useScreenDimensions()

  const productivity = Math.round(
    (screen.workingSpeed / screen.targetPercentage || 0) * 100
  )

  const color =
    productivity >= 80
      ? '#57CA22'
      : productivity > 0 && productivity < 80
      ? '#ef6c00'
      : '#FF1943'

  const items = [
    {
      title: 'Hedef',
      description: `${Math.round(screen.targetPercentage) || 0} m/dk`
    },
    {
      title: 'Ort',
      description: `${Math.round(screen.workingSpeed) || 0} m/dk`
    },
    {
      title: 'Anlık',
      description: `${Math.round(screen.actualSpeed) || 0} m/dk`
    },
    {
      title: 'Verim',
      description: `%${productivity}`,
      color
    }
  ]

  return (
    <Grid
      container
      spacing={0}
      style={{ height, width, background: color, borderLeft: border }}
    >
      <Typography
        p={3}
        height={250}
        fontSize="4vw"
        fontWeight="bold"
        textAlign="left"
        backgroundColor="#FFA319"
        width="100%"
      >
        {screen.slideHeader}
      </Typography>

      {items.map((item, index) => (
        <Grid item xs={12} key={index} gap={0}>
          <Box
            style={{
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              style={{
                fontSize: '4vw',
                display: 'inline',
                fontWeight: 'bold'
              }}
            >
              {item.title} :
            </Typography>
            <Typography
              style={{
                fontWeight: 'bold',
                display: 'inline',
                fontSize: '7.5vw',
                float: 'right'
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
