import { useRouter } from 'next/router';
import { Checkbox } from '../../../../components/react-hook-form-ui';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import DataFetchWrapper from '../../../../components/DataFetchWrapper';
import {
  editInvoice,
  fetchInvoiceById,
  deleteInvoice,
} from '../../../../services/api';
import {
  PricedLineItems,
  TextField,
} from '../../../../components/react-hook-form-ui';
import SubmitButton from '../../../../ui/SubmitButton';
import ValidationErrors from '../../../../ui/ValidationErrors';
import {
  alertModalSuccess,
  alertModalError,
} from '../../../../actions/alertModalActions';

export default function EditInvoice() {
  const [invoiceId, setInvoiceId] = useState(undefined);
  const reactHookFormMethods = useForm();
  const { handleSubmit, setValue: setFormValue } = reactHookFormMethods;
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const id = router.query?.id;
    if (id) setInvoiceId(id);
  }, [router.query.id]);
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState([]);
  const { status, data } = useQuery(['invoiceData', { invoiceId }], () => {
    if (invoiceId) return fetchInvoiceById(invoiceId);
  });
  const invoiceData = data?.invoice;
  const customer = invoiceData?.customer;

  useEffect(() => {
    let invoiceLineItems = invoiceData?.invoiceLineItems;
    if (invoiceLineItems) {
      let { dueDate, canceled } = invoiceData;
      if (dueDate) setFormValue('dueDate', dueDate.split('T')[0]);
      if (canceled) setFormValue('canceled', canceled);
      invoiceLineItems = invoiceLineItems.map(
        ({ id, name, description, price }) => ({ id, name, description, price })
      );
      setFormValue('invoiceLineItemsAttributes', invoiceLineItems);
    }
  }, [invoiceData]);

  const { mutate: onSubmit, status: formStatus } = useMutation(
    (updatedInvoice) => editInvoice(invoiceId, updatedInvoice),
    {
      onMutate: async (updatedInvoice) => {
        await queryClient.cancelQueries(['invoiceData', { invoiceId }]);
        const previousData = queryClient.getQueryData([
          'invoiceData',
          { invoiceId },
        ]);
        queryClient.setQueryData(['invoiceData', { invoiceId }], (oldData) => ({
          ...oldData,
          invoice: updatedInvoice,
        }));
        return previousData;
      },
      onError: (error, updatedInvoice, previousData) => {
        setValidationErrors(error.validationErrors);
        dispatch(alertModalError('unable to save changes'));
        return queryClient.setQueryData(
          ['invoiceData', { invoiceId }],
          previousData
        );
      },
      onSuccess: () => {
        dispatch(alertModalSuccess('invoice updated'));
        setValidationErrors([]);
      },
      onSettled: () =>
        queryClient.invalidateQueries(['invoiceData', { invoiceId }]),
    }
  );
  const { mutate: handleDelete } = useMutation(() => deleteInvoice(invoiceId), {
    onError: () => dispatch(alertModalError('unable to delete invoice')),
    onSuccess: () => {
      dispatch(alertModalSuccess('invoice deleted'));
      router.push('/dashboard/invoices');
    },
  });

  return (
    <DataFetchWrapper
      dataName="Invoice Details"
      status={status}
      hasData={invoiceData}
    >
      <div className="app-header">
        <div className="app-header-left">
          <h1>Invoice #{invoiceData?.id}</h1>
        </div>
        <div className="app-header-right">
          <button
            onClick={() => router.back()}
            className="button is-primary is-rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      <FormProvider {...reactHookFormMethods}>
        <form
          className="columns is-multiline box box mx-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <ValidationErrors errors={validationErrors} />
          <div className="column is-12">
            <h1 className="title">{invoiceData?.businessName}</h1>
          </div>

          <div className="column">
            <h6 className="has-text-weight-bold">Billed to</h6>
            {customer && (
              <>
                <p>{customer.fullName}</p>
                <p>{customer.address1}</p>
                <p>{customer.address2}</p>
                <p>
                  {customer.city} {customer.state} {customer.zipCode}
                </p>
              </>
            )}
          </div>
          <div className="column is-narrow ">
            <TextField
              name="dueDate"
              type="date"
              label="Due Date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div className="mt-4">
              <Checkbox name="canceled" label="Mark invoice as canceled" />
            </div>
          </div>

          <div className="column is-12">
            {invoiceData?.invoiceLineItems && (
              <PricedLineItems fieldArrayName={'invoiceLineItemsAttributes'} />
            )}

            <SubmitButton status={formStatus}>Save Changes</SubmitButton>
            <br />
            <button
              onClick={handleDelete}
              className="mt-5 button is-danger is-outlined is-rounded"
              type="button"
            >
              Delete Invoice
            </button>
          </div>
        </form>
      </FormProvider>
    </DataFetchWrapper>
  );
}
