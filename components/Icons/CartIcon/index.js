
import { memo } from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    width: 18,
    height: 18
  }
}));

const CartIcon = ({
  className,
  viewBox,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <SvgIcon viewBox={viewBox || '0 0 18 18'} {...rest} className={clsx(classes.root, className)}>
      <path fillRule="evenodd" clipRule="evenodd" d="M3.13524 1.5H0.75C0.335786 1.5 0 1.16421 0 0.75C0 0.335786 0.335786 0 0.75 0H3.75C4.10747 0 4.41526 0.252289 4.48541 0.602807L5.11532 3.75H17.25C17.7205 3.75 18.0749 4.17828 17.9867 4.6405L16.7856 10.9386C16.5733 12.0076 15.6253 12.7707 14.55 12.75L7.27437 12.7499C6.18468 12.7707 5.2367 12.0076 5.02459 10.9397L3.77159 4.6794C3.76651 4.6587 3.76229 4.63765 3.75896 4.61631L3.13524 1.5ZM5.25 15.7512C5.25 16.652 5.84951 17.2525 6.74878 17.2525C7.64804 17.2525 8.24755 16.652 8.24755 15.7512C8.24755 14.8505 7.64804 14.25 6.74878 14.25C5.84951 14.25 5.25 14.8505 5.25 15.7512ZM13.5 15.75C13.5 16.65 14.0995 17.25 14.9988 17.25C15.898 17.25 16.4976 16.65 16.4976 15.75C16.4976 14.85 15.898 14.25 14.9988 14.25C14.0995 14.25 13.5 14.85 13.5 15.75ZM6.49564 10.6464L5.41555 5.25H16.3435L15.3133 10.652C15.2436 11.0027 14.9276 11.2571 14.5644 11.2501L7.26001 11.25C6.88241 11.2571 6.56641 11.0027 6.49564 10.6464Z" fill="#6E6B7B" />
    </SvgIcon>
  )
}

export default memo(CartIcon);
