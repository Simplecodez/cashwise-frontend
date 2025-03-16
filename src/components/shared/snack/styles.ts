import { MaterialDesignContent } from 'notistack';
import styled from 'styled-components';

type StyledIconProps = {
  mode: 'light' | 'dark';
  color: 'primary' | 'success' | 'secondary' | 'error';
};

export const StyledIcon = styled.span<StyledIconProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: ${({ theme, color }) => {
    switch (color) {
      case 'primary':
        return theme.palette.primary || '#007bff';
      case 'success':
        return theme.palette.success || '#28a745';
      case 'secondary':
        return theme.palette.warning || '#ffc107';
      case 'error':
        return theme.palette.error || '#dc3545';
      default:
        return theme.palette.text || '#000';
    }
  }};
`;

export const StyledNotistack = styled(MaterialDesignContent)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.shadow.small};
  background-color: ${({ theme }) => theme.palette.background || '#fff'};
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return theme.palette.success || '#d4edda'; // Light green
      case 'error':
        return theme.palette.error || '#f8d7da'; // Light red
      case 'warning':
        return theme.palette.warning || '#fff3cd'; // Light yellow
      default:
        return theme.palette.background || '#fff'; // Default white
    }
  }};
  min-width: 280px;
  max-width: 400px;
`;
