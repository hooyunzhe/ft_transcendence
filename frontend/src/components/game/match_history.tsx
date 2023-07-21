"use client"

// At the top of your component file

import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableHead-root': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td': {
    borderBottom: 0,
  },
}));

interface MatchData{
  uid: number;
	winner_uid: number;
	p1_uid: number;
	p2_uid: number;
	p1_score: number;
	p2_score: number;
}

export function MatchHistoryHeadComponent({ children }: { children: React.ReactNode }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Match_id</StyledTableCell>
            <StyledTableCell align="right">Winner</StyledTableCell>
            <StyledTableCell align="right">Player 1</StyledTableCell>
            <StyledTableCell align="right">Player 2</StyledTableCell>
            <StyledTableCell align="right">Player 1 Score</StyledTableCell>
            <StyledTableCell align="right">Player 2 Score</StyledTableCell>
          </TableRow>
        </TableHead>
        {children}
      </Table>
    </TableContainer>
  );
}

export function MatchHistoryComponent({rows}: {rows: MatchData[]}) {
  return (
    <>
      {rows.map((row) => (
        <StyledTableRow key={row.uid}>
          <StyledTableCell component="th" scope="row">
            {row.uid}
          </StyledTableCell>
          <StyledTableCell align="right">{row.winner_uid}</StyledTableCell>
          <StyledTableCell align="right">{row.p1_uid}</StyledTableCell>
          <StyledTableCell align="right">{row.p2_uid}</StyledTableCell>
          <StyledTableCell align="right">{row.p1_score}</StyledTableCell>
          <StyledTableCell align="right">{row.p2_score}</StyledTableCell>
        </StyledTableRow>
      ))}
    </>
  );
}