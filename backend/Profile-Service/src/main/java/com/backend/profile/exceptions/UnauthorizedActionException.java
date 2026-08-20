package com.backend.profile.exceptions;

public class UnauthorizedActionException extends RuntimeException {

	public UnauthorizedActionException(String errmsg) {
		super(errmsg);
	}
}
