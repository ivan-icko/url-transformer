import { ResponseService } from '../../../../src/common/modules/response/response.service';

export const successMock = jest.fn((data: any) => {
  return { stores: data };
});
export const errorMock = jest.fn((data: any) => {
  return data;
});

export const ResponseMock = jest.fn().mockImplementation(() => {
  return {
    success: successMock,
    error: errorMock,
  };
});

export const ResponseServiceProviderMock = {
  provide: ResponseService,
  useClass: ResponseMock,
};
