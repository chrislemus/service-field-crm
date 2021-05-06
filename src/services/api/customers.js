import { InvertColorsOff } from '@material-ui/icons';
import { axiosApi } from './axiosApi';

const fetchCustomers = async (query, pageLimit, page) => {
  return await axiosApi.get(
    `/customers?query=${query}&limit=${pageLimit}&page=${page}`
  );
};

const addNewCustomer = (customer) => {
  return (dispatch) => {
    dispatch({ type: 'CUSTOMER_FETCH' });
    axiosApi
      .post('/customers', { customer })
      .then(({ data }) => {
        const customerId = data?.customer?.id;
        dispatch({ type: 'CUSTOMER_ADD_NEW_SUCCESS' });
        // history.push(`/customers/${customerId}`);
      })
      .catch(({ validationErrors }) => {
        dispatch({ type: 'CUSTOMER_FETCH_FAILED', payload: validationErrors });
      });
  };
};
/*
  error {
    response {
      message: ''
    }
  }
  

  error {
    validationErrors: ['dwd', 'dwd'],
    response {
      message: ''
    }
  }
*/

const editCustomer = (customerId, customer) => {
  return (dispatch) => {
    dispatch({ type: 'CUSTOMER_FETCH' });
    axiosApi
      .patch(`/customers/${customerId}`, { customer })
      .then(({ data }) => {
        const { customer } = data;
        dispatch({ type: 'CUSTOMER_EDIT_SUCCESS', payload: customer });
        // dispatch(alertModalSuccess('Successfully updated Customer'));
      })
      .catch(({ validationErrors }) => {
        dispatch({
          type: 'CUSTOMER_FETCH_FAILED',
          payload: validationErrors,
        });
      });
  };
};

const fetchCustomerById = async (customerId) => {
  return await axiosApi.get(`/customers/${customerId}`);
  // .then(({ data }) => {
  //   const customer = data?.customer;
  //   dispatch({ type: 'CUSTOMER_FETCH_BY_ID_SUCCESS', payload: customer });
  // })
  // .catch(({ validationErrors }) => {
  //   dispatch({ type: 'CUSTOMER_FETCH_FAILED', payload: validationErrors });
  // });
};

export { fetchCustomers, fetchCustomerById, addNewCustomer, editCustomer };
