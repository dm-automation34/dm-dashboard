import { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { useDispatch, useSelector } from 'src/redux/store'
import { getScreens } from 'src/redux/slices/screen'
import { useRouter } from 'next/router'
import { SliderItem } from './SliderItem'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export const StatisticList = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return
    const { MachineId1, MachineId2 } = router.query

    dispatch(getScreens(MachineId1, MachineId2))

    const intervalId = setInterval(() => {
      dispatch(getScreens(MachineId1, MachineId2))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [router.isReady, router.query, dispatch])

  const dispatch = useDispatch()

  const { screens } = useSelector((state) => state.screen)

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-between' }}
      >
        {screens && screens.length > 0 ? (
          <Swiper spaceBetween={0} slidesPerView={1}>
            <SwiperSlide>
              <Grid display={'flex'} justifyContent={'row'} gap={0}>
                {screens.map((screen) => (
                  <SliderItem
                    key={screen.machineName}
                    screen={screen}
                    border="6px solid #000"
                  />
                ))}
              </Grid>
            </SwiperSlide>
          </Swiper>
        ) : null}
      </Box>
    </>
  )
}
