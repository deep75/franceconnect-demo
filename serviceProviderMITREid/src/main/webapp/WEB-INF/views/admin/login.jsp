<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<html>
<head>
 <title>Poc client FranceConnect</title>
	<!-- Bootstrap -->
	<link href="${pageContext.request.contextPath}/resources/bootstrap/css/bootstrap.min.css" rel="stylesheet"
		media="screen">
	<link href="${pageContext.request.contextPath}/resources/bootstrap/css/bootstrap-theme.min.css" rel="stylesheet"
		media="screen">
	<link href="${pageContext.request.contextPath}/resources/bootstrap/css/custom.css" rel="stylesheet"
		media="screen">
	<link href="${pageContext.request.contextPath}/resources/jquery/jquery-ui.min.css" rel="stylesheet"
		media="screen">
	<script src="${pageContext.request.contextPath}/resources/jquery.js"></script>
	<script src="${pageContext.request.contextPath}/resources/jquery/jquery-ui.min.js"></script>
	
	<script src="${pageContext.request.contextPath}/resources/bootstrap/js/bootstrap.min.js"></script>

</head>
<body>
<h1>Login</h1>

<div class="container-fluid main">
	<div class="row-fluid">
		<div class="span10 offset1">
			
			
			<div class="well">
				
				<div class="row-fluid">
	
					<div class="span8">
						<p>Connectez vous via FranceConnect : </p>
					
						<form action="${pageContext.request.contextPath}/openid_connect_login" method="get">
							<input type="image" src="${pageContext.request.contextPath}/resources/Logo FC.png"  alt="Log In" id="login"/>
						</form>
					</div>
	
				</div>

		</div>
	</div>
</div>
</div>

</body>
</html>
