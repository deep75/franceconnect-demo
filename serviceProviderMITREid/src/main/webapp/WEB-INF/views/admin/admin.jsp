<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<div class="container-fluid main">
	<div class="row-fluid">
		<div class="span10 offset1">

			<h1>Bonjour ${ userInfo.name }</h1>

			<div>
				<p>Cette page nécessite d'être loggé avec un compte ayant le role <code>ROLE_ADMIN</code> (Spring Security authority).
				Si vous pouvez lire cette page, <span class="text-success">vous être conencté en tant qu'administrateur</span>.</p>

				<p>Vous êtes actuellement connecté avec les roles suivants (Spring Security authorities):</p>
				
				<ul>
					<security:authentication property="authorities" var="authorities" />
					<c:forEach items="${authorities}" var="auth">
						<li><code>${ auth }</code></li>
					</c:forEach>
				</ul>
				
			</div>
		</div>
	</div>
</div>