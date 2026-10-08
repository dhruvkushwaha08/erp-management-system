import React from 'react';

import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Reusable status chip.
 *
 * Used by Orders and other ERP pages.
 */
export function StatusChip({ status, value }) {
  const currentStatus = status ?? value ?? 'Unknown';

  const normalizedStatus = String(currentStatus).toLowerCase();

  let color = 'default';

  if (
    ['approved', 'completed', 'paid', 'received', 'active', 'success'].includes(
      normalizedStatus
    )
  ) {
    color = 'success';
  } else if (
    ['pending', 'draft', 'processing', 'created'].includes(normalizedStatus)
  ) {
    color = 'warning';
  } else if (
    ['cancelled', 'canceled', 'rejected', 'failed', 'inactive'].includes(
      normalizedStatus
    )
  ) {
    color = 'error';
  } else if (
    ['sent', 'confirmed', 'issued'].includes(normalizedStatus)
  ) {
    color = 'info';
  }

  return (
    <Chip
      label={currentStatus}
      color={color}
      size="small"
      variant="outlined"
    />
  );
}

/**
 * Reusable CRUD table used throughout the ERP.
 */
export default function CrudTable({
  columns = [],
  rows = [],
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const handlePageChange = (_event, newPage) => {
    if (onPageChange) {
      onPageChange(newPage + 1);
    }
  };

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: '#f8fafc',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}

              {hasActions && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    backgroundColor: '#f8fafc',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  align="center"
                  sx={{ py: 5 }}
                >
                  <Typography color="text.secondary">
                    No records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow
                  key={row._id || row.id || index}
                  hover
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(row)
                        : row[column.key] ?? '—'}
                    </TableCell>
                  ))}

                  {hasActions && (
                    <TableCell align="right">
                      {onEdit && (
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => onEdit(row)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}

                      {onDelete && (
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onDelete(row)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={Math.max(page - 1, 0)}
          onPageChange={handlePageChange}
          rowsPerPage={limit}
          rowsPerPageOptions={[limit]}
        />
      )}
    </Paper>
  );
}