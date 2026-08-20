package com.backend.profile.exceptions;

public class DuplicateResourceException extends RuntimeException {

	public DuplicateResourceException(String errmsg) {
		super(errmsg);
	}
}
