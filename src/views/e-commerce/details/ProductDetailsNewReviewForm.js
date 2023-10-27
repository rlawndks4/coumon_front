import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Button,
  Rating,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormHelperText,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSettingsContext } from 'src/components/settings';
import { addProductReviewByUser } from 'src/utils/api-shop';
import { useAuthContext } from 'src/auth/useAuthContext';
import { toast } from 'react-hot-toast';
// components

// ----------------------------------------------------------------------

ProductDetailsNewReviewForm.propTypes = {
  onClose: PropTypes.func,
};

export default function ProductDetailsNewReviewForm({ onClose, onChangePage, ...other }) {
  const router = useRouter();
  const { themeDnsData } = useSettingsContext();
  const { user } = useAuthContext();
  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    review: Yup.string().required('Review is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });
  const [reviewData, setReviewData] = useState({
    product_id: router.query?.id,
    trans_id: '1',
    brand_id: themeDnsData?.id,
    scope: 0,
    nick_name: user?.nick_name || `구매자${router.query?.id}${new Date().getTime()}`,
    profile_img: user?.profile_img ?? "",
    content: '',
    password: '1234'
  })
  const defaultValues = {
    rating: null,
    review: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onCancel = () => {
    onClose();
    reset();
  };
  const onSubmit = async () => {
    let result = await addProductReviewByUser(reviewData);
    if(result){
      toast.success("성공적으로 리뷰를 작성하였습니다.");
      onClose();
      onChangePage(1);
    }
  }
  return (
    <Dialog onClose={onClose} {...other}>
      <DialogTitle>리뷰 작성하기</DialogTitle>

      <DialogContent>
        <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
          <Typography variant="body2">별점을 체크해 주세요:</Typography>

          <Controller
            name="rating"
            control={control}
            render={({ field }) => <Rating {...field} value={reviewData.scope / 2} onChange={(e) => {
              console.log(e.target.value)
              setReviewData({
                ...reviewData,
                scope: e.target.value * 2
              })
            }} />}
          />
        </Stack>

        {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}

        <TextField name="review" label="리뷰를 작성해 주세요." multiline rows={6} sx={{ mt: 3, width: '100%' }} onChange={(e) => {
          setReviewData({
            ...reviewData,
            content: e.target.value
          })
        }} />
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onCancel}>
          취소
        </Button>

        <Button type="submit" variant="contained" onClick={onSubmit}>
          리뷰 추가하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
