package com.backend.profile.exceptions;

public class ResourceNotFoundException extends RuntimeException {
	
  public ResourceNotFoundException(String errmsg)
  {
	  super(errmsg);
  }
}
