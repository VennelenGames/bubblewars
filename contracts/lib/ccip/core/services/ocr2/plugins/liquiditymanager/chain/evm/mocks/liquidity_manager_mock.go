// Code generated by mockery v2.43.2. DO NOT EDIT.

package mocks

import (
	context "context"
	big "math/big"

	mock "github.com/stretchr/testify/mock"

	models "github.com/smartcontractkit/chainlink/v2/core/services/ocr2/plugins/liquiditymanager/models"

	types "github.com/smartcontractkit/libocr/offchainreporting2plus/types"
)

// LiquidityManager is an autogenerated mock type for the LiquidityManager type
type LiquidityManager struct {
	mock.Mock
}

type LiquidityManager_Expecter struct {
	mock *mock.Mock
}

func (_m *LiquidityManager) EXPECT() *LiquidityManager_Expecter {
	return &LiquidityManager_Expecter{mock: &_m.Mock}
}

// Close provides a mock function with given fields: ctx
func (_m *LiquidityManager) Close(ctx context.Context) error {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for Close")
	}

	var r0 error
	if rf, ok := ret.Get(0).(func(context.Context) error); ok {
		r0 = rf(ctx)
	} else {
		r0 = ret.Error(0)
	}

	return r0
}

// LiquidityManager_Close_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'Close'
type LiquidityManager_Close_Call struct {
	*mock.Call
}

// Close is a helper method to define mock.On call
//   - ctx context.Context
func (_e *LiquidityManager_Expecter) Close(ctx interface{}) *LiquidityManager_Close_Call {
	return &LiquidityManager_Close_Call{Call: _e.mock.On("Close", ctx)}
}

func (_c *LiquidityManager_Close_Call) Run(run func(ctx context.Context)) *LiquidityManager_Close_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context))
	})
	return _c
}

func (_c *LiquidityManager_Close_Call) Return(_a0 error) *LiquidityManager_Close_Call {
	_c.Call.Return(_a0)
	return _c
}

func (_c *LiquidityManager_Close_Call) RunAndReturn(run func(context.Context) error) *LiquidityManager_Close_Call {
	_c.Call.Return(run)
	return _c
}

// ConfigDigest provides a mock function with given fields: ctx
func (_m *LiquidityManager) ConfigDigest(ctx context.Context) (types.ConfigDigest, error) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for ConfigDigest")
	}

	var r0 types.ConfigDigest
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context) (types.ConfigDigest, error)); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) types.ConfigDigest); ok {
		r0 = rf(ctx)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(types.ConfigDigest)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// LiquidityManager_ConfigDigest_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'ConfigDigest'
type LiquidityManager_ConfigDigest_Call struct {
	*mock.Call
}

// ConfigDigest is a helper method to define mock.On call
//   - ctx context.Context
func (_e *LiquidityManager_Expecter) ConfigDigest(ctx interface{}) *LiquidityManager_ConfigDigest_Call {
	return &LiquidityManager_ConfigDigest_Call{Call: _e.mock.On("ConfigDigest", ctx)}
}

func (_c *LiquidityManager_ConfigDigest_Call) Run(run func(ctx context.Context)) *LiquidityManager_ConfigDigest_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context))
	})
	return _c
}

func (_c *LiquidityManager_ConfigDigest_Call) Return(_a0 types.ConfigDigest, _a1 error) *LiquidityManager_ConfigDigest_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *LiquidityManager_ConfigDigest_Call) RunAndReturn(run func(context.Context) (types.ConfigDigest, error)) *LiquidityManager_ConfigDigest_Call {
	_c.Call.Return(run)
	return _c
}

// GetBalance provides a mock function with given fields: ctx
func (_m *LiquidityManager) GetBalance(ctx context.Context) (*big.Int, error) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for GetBalance")
	}

	var r0 *big.Int
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context) (*big.Int, error)); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) *big.Int); ok {
		r0 = rf(ctx)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*big.Int)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// LiquidityManager_GetBalance_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GetBalance'
type LiquidityManager_GetBalance_Call struct {
	*mock.Call
}

// GetBalance is a helper method to define mock.On call
//   - ctx context.Context
func (_e *LiquidityManager_Expecter) GetBalance(ctx interface{}) *LiquidityManager_GetBalance_Call {
	return &LiquidityManager_GetBalance_Call{Call: _e.mock.On("GetBalance", ctx)}
}

func (_c *LiquidityManager_GetBalance_Call) Run(run func(ctx context.Context)) *LiquidityManager_GetBalance_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context))
	})
	return _c
}

func (_c *LiquidityManager_GetBalance_Call) Return(_a0 *big.Int, _a1 error) *LiquidityManager_GetBalance_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *LiquidityManager_GetBalance_Call) RunAndReturn(run func(context.Context) (*big.Int, error)) *LiquidityManager_GetBalance_Call {
	_c.Call.Return(run)
	return _c
}

// GetLatestSequenceNumber provides a mock function with given fields: ctx
func (_m *LiquidityManager) GetLatestSequenceNumber(ctx context.Context) (uint64, error) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for GetLatestSequenceNumber")
	}

	var r0 uint64
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context) (uint64, error)); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) uint64); ok {
		r0 = rf(ctx)
	} else {
		r0 = ret.Get(0).(uint64)
	}

	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// LiquidityManager_GetLatestSequenceNumber_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GetLatestSequenceNumber'
type LiquidityManager_GetLatestSequenceNumber_Call struct {
	*mock.Call
}

// GetLatestSequenceNumber is a helper method to define mock.On call
//   - ctx context.Context
func (_e *LiquidityManager_Expecter) GetLatestSequenceNumber(ctx interface{}) *LiquidityManager_GetLatestSequenceNumber_Call {
	return &LiquidityManager_GetLatestSequenceNumber_Call{Call: _e.mock.On("GetLatestSequenceNumber", ctx)}
}

func (_c *LiquidityManager_GetLatestSequenceNumber_Call) Run(run func(ctx context.Context)) *LiquidityManager_GetLatestSequenceNumber_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context))
	})
	return _c
}

func (_c *LiquidityManager_GetLatestSequenceNumber_Call) Return(_a0 uint64, _a1 error) *LiquidityManager_GetLatestSequenceNumber_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *LiquidityManager_GetLatestSequenceNumber_Call) RunAndReturn(run func(context.Context) (uint64, error)) *LiquidityManager_GetLatestSequenceNumber_Call {
	_c.Call.Return(run)
	return _c
}

// GetRebalancers provides a mock function with given fields: ctx
func (_m *LiquidityManager) GetRebalancers(ctx context.Context) (map[models.NetworkSelector]models.Address, error) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for GetRebalancers")
	}

	var r0 map[models.NetworkSelector]models.Address
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context) (map[models.NetworkSelector]models.Address, error)); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) map[models.NetworkSelector]models.Address); ok {
		r0 = rf(ctx)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(map[models.NetworkSelector]models.Address)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// LiquidityManager_GetRebalancers_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GetRebalancers'
type LiquidityManager_GetRebalancers_Call struct {
	*mock.Call
}

// GetRebalancers is a helper method to define mock.On call
//   - ctx context.Context
func (_e *LiquidityManager_Expecter) GetRebalancers(ctx interface{}) *LiquidityManager_GetRebalancers_Call {
	return &LiquidityManager_GetRebalancers_Call{Call: _e.mock.On("GetRebalancers", ctx)}
}

func (_c *LiquidityManager_GetRebalancers_Call) Run(run func(ctx context.Context)) *LiquidityManager_GetRebalancers_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context))
	})
	return _c
}

func (_c *LiquidityManager_GetRebalancers_Call) Return(_a0 map[models.NetworkSelector]models.Address, _a1 error) *LiquidityManager_GetRebalancers_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *LiquidityManager_GetRebalancers_Call) RunAndReturn(run func(context.Context) (map[models.NetworkSelector]models.Address, error)) *LiquidityManager_GetRebalancers_Call {
	_c.Call.Return(run)
	return _c
}

// GetTokenAddress provides a mock function with given fields: ctx
func (_m *LiquidityManager) GetTokenAddress(ctx context.Context) (models.Address, error) {
	ret := _m.Called(ctx)

	if len(ret) == 0 {
		panic("no return value specified for GetTokenAddress")
	}

	var r0 models.Address
	var r1 error
	if rf, ok := ret.Get(0).(func(context.Context) (models.Address, error)); ok {
		return rf(ctx)
	}
	if rf, ok := ret.Get(0).(func(context.Context) models.Address); ok {
		r0 = rf(ctx)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(models.Address)
		}
	}

	if rf, ok := ret.Get(1).(func(context.Context) error); ok {
		r1 = rf(ctx)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// LiquidityManager_GetTokenAddress_Call is a *mock.Call that shadows Run/Return methods with type explicit version for method 'GetTokenAddress'
type LiquidityManager_GetTokenAddress_Call struct {
	*mock.Call
}

// GetTokenAddress is a helper method to define mock.On call
//   - ctx context.Context
func (_e *LiquidityManager_Expecter) GetTokenAddress(ctx interface{}) *LiquidityManager_GetTokenAddress_Call {
	return &LiquidityManager_GetTokenAddress_Call{Call: _e.mock.On("GetTokenAddress", ctx)}
}

func (_c *LiquidityManager_GetTokenAddress_Call) Run(run func(ctx context.Context)) *LiquidityManager_GetTokenAddress_Call {
	_c.Call.Run(func(args mock.Arguments) {
		run(args[0].(context.Context))
	})
	return _c
}

func (_c *LiquidityManager_GetTokenAddress_Call) Return(_a0 models.Address, _a1 error) *LiquidityManager_GetTokenAddress_Call {
	_c.Call.Return(_a0, _a1)
	return _c
}

func (_c *LiquidityManager_GetTokenAddress_Call) RunAndReturn(run func(context.Context) (models.Address, error)) *LiquidityManager_GetTokenAddress_Call {
	_c.Call.Return(run)
	return _c
}

// NewLiquidityManager creates a new instance of LiquidityManager. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewLiquidityManager(t interface {
	mock.TestingT
	Cleanup(func())
}) *LiquidityManager {
	mock := &LiquidityManager{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}