import {useState} from 'react';
import {Card, TextContainer, Text} from '@shopify/polaris';
import {Toast} from '@shopify/app-bridge-react';
import {useTranslation} from 'react-i18next';
import {useAppQuery, useAuthenticatedFetch} from '../hooks';

export function ProductsCard() {
  const emptyToastProps = {content: null};
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptTagPopulated, setIsScriptTagPopulated] = useState(false);
  const [scriptTagData, setScriptTagData] = useState(null);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const {t} = useTranslation();
  const productsCount = 5;

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: '/api/products/count',
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch('/api/products/create');

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t('ProductsCard.productsCreatedToast', {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t('ProductsCard.errorCreatingProductsToast'),
        error: true,
      });
    }
  };

  const handleScriptTagPopulate = () => {
    setIsLoading(true);
    fetch('/api/scriptTag/create')
      .then((response) => response.json())
      .then((data) => {
        setToastProps({
          content: t('ScriptTag.createdToast'),
        });
        setIsLoading(false);
        setIsScriptTagPopulated(true);
        setScriptTagData(data.data.scriptTag);
      })
      .catch((error) => {
        setIsLoading(false);
        setToastProps({
          content: t('ScriptTag.errorCreatingToast'),
          error: true,
        });
      });
  };

  const removeScriptTag = () => {
    fetch(
      `/api/scriptTag/remove?id=
    ${scriptTagData.id}`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setToastProps({
          content: t('ScriptTag.deletedToast'),
        });
        setIsLoading(false);
        setIsScriptTagPopulated(false);
        setScriptTagData(null);
      })
      .catch((error) => {
        setIsLoading(false);
        setToastProps({
          content: t('ScriptTag.errorDeletingToast'),
          error: true,
        });
      });
  };

  return (
    <>
      {toastMarkup}
      <Card
        title={t('ScriptTag.title')}
        sectioned
        primaryFooterAction={{
          content: t(
            isScriptTagPopulated
              ? 'ScriptTag.removeScriptTagButton'
              : 'ScriptTag.populateScriptTagButton'
          ),
          onAction: isScriptTagPopulated
            ? removeScriptTag
            : handleScriptTagPopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>{t('ScriptTag.description')}</p>
        </TextContainer>
      </Card>
    </>
  );
}
