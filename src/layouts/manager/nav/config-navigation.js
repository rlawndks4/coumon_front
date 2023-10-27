// routes
import { PATH_MANAGER } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useEffect } from 'react';
import { apiManager } from 'src/utils/api-manager';
import { useState } from 'react';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};
const navConfig = () => {
  const { user } = useAuthContext();

  const [productCategoryList, setProductCategoryList] = useState([]);
  const isDeveloper = () => {
    return user?.level >= 50
  }
  useEffect(() => {
    settingSidebar();
  }, [])

  const settingSidebar = async () => {
    let product_category_list = await apiManager('product-categories', 'list');
    setProductCategoryList(product_category_list?.content ?? []);

  }
  return [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      items: [
        { title: '대시보드', path: PATH_MANAGER.dashboards, icon: ICONS.dashboard },
      ],
    },
    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      items: [
        {
          title: '상품관리',
          path: PATH_MANAGER.product.root,
          icon: ICONS.user,
          children: [
            {
              title: '상품관리', path: PATH_MANAGER.product.list,
            },
            { title: '상품카테고리관리', path: PATH_MANAGER.product.category.list },
          ],
        },
      ],
    },
    {
      items: [
        {
          title: '고객관리',
          path: PATH_MANAGER.customer.root,
          icon: ICONS.user,
          children: [
            { title: '회원관리', path: PATH_MANAGER.customer.list },
          ],
        },
      ],
    },
    ...(user?.level >= 40 ? [
      {
        items: [
          {
            title: '설정관리',
            path: PATH_MANAGER.brand.root,
            icon: ICONS.user,
            children: [
              { title: '기본설정', path: PATH_MANAGER.brand.edit },
              { title: '쇼핑몰디자인관리', path: PATH_MANAGER.brand.shopDesign },
              ...(user?.level >= 50 ? [{
                title: '브랜드관리', path: PATH_MANAGER.brand.list
              }] : []),
            ],
          },
        ],
      },
    ] : []),
    ...(isDeveloper() ? [
      {
        items: [
          {
            title: '로그관리',
            path: PATH_MANAGER.log.root,
            icon: ICONS.user,
            children: [
              { title: '로그관리', path: PATH_MANAGER.log.list },
            ],
          },
        ],
      },
    ] : [])
  ];
}

export default navConfig;
