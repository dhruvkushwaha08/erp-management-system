import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap'
      }}
    >
      <Box>
        <Typography
          variant="h4"
          fontWeight={800}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action}
    </Box>
  );
}