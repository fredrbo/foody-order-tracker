package com.foody.ordertracker.service;

import com.foody.ordertracker.dto.UserRequest;
import com.foody.ordertracker.dto.UserResponse;

public interface IUserService {

    UserResponse create(UserRequest request);
}
