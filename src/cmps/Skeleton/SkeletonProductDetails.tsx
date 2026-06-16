import { Skeleton, Box, Grid } from "@mui/material"

export const SkeletonProductDetails = () => {
    return (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Grid container spacing={4}>
                {/* Info side */}
                <Grid item xs={12} md={6}>
                    <Skeleton variant="text" width="60%" height={60} />
                    <Skeleton variant="text" width="40%" height={40} sx={{ mb: 4 }} />
                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={100} />
                </Grid>

                {/* Gallery side */}
                <Grid item xs={12} md={6}>
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Skeleton variant="rectangular" width={80} height={80} />
                        <Skeleton variant="rectangular" width={80} height={80} />
                        <Skeleton variant="rectangular" width={80} height={80} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}