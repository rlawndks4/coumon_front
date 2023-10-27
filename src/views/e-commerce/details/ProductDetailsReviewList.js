import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Stack, Button, Rating, Avatar, Pagination, Typography } from '@mui/material';
// utils
import { fDate } from 'src/utils/formatTime';
// components
import Iconify from 'src/components/iconify/Iconify';
import { commarNumber } from 'src/utils/function';

// ----------------------------------------------------------------------

ProductDetailsReviewList.propTypes = {
  reviews: PropTypes.array,
};

export default function ProductDetailsReviewList({ reviews = [], reviewContent, onChangePage }) {
  const getMaxPage = (total, page_size) => {
    if (total == 0) {
      return 1;
    }
    if (total % page_size == 0) {
      return parseInt(total / page_size);
    } else {
      return parseInt(total / page_size) + 1;
    }
  }
  return (
    <>
      <Stack
        spacing={5}
        sx={{
          pt: 5,
          pl: {
            xs: 2.5,
            md: 0,
          },
          pr: {
            xs: 2.5,
            md: 5,
          },
        }}
      >
        {reviewContent?.content && reviewContent?.content.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </Stack>

      <Stack
        alignItems={{
          xs: 'center',
          md: 'flex-end',
        }}
        sx={{
          my: 5,
          mr: { md: 5 },
        }}
      >
        <Pagination
          count={getMaxPage(reviewContent?.total, reviewContent?.page_size)}
          page={parseInt(reviewContent?.page)}
          onChange={(_, num) => {
            onChangePage(num)
          }}
        />
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ review }) {
  const { name, nick_name, rating, scope, content, comment, helpful, postedAt, avatarUrl, isPurchased, created_at } = review;

  return (
    <Stack
      spacing={2}
      direction={{
        xs: 'column',
        md: 'row',
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'row',
          md: 'column',
        }}
        sx={{
          width: { md: 240 },
          textAlign: { md: 'center' },
        }}
        style={{
          width: '240px !important'
        }}
      >
        <Avatar
          src={avatarUrl}
          sx={{
            width: { md: 64 },
            height: { md: 64 },
          }}
        />

        <Stack spacing={{ md: 0.5 }}>
          <Typography variant="subtitle2" noWrap>
            {nick_name}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {created_at}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={1} flexGrow={1} style={{
        maxWidth: '920px'
      }}>
        <Rating size="small" value={scope / 2} precision={0.1} readOnly />
        {isPurchased && (
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'success.main',
            }}
          >
            <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
            Verified purchase
          </Typography>
        )}

        <Typography variant="body2">{content}</Typography>
      </Stack>
    </Stack>
  );
}
