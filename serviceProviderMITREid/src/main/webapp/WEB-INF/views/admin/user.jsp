<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<div class="container-fluid main">
	<div class="row-fluid">
		<div class="span10 offset1">

			<h1>Bonjour ${ userInfo.name }</h1>

			<div>
				<p>Cette page nécessite d'être connecté avec un compte valide ayant le rôle <code>ROLE_USER</code> (Spring Security authority). Ce rôle est donné à tout utilisateur connecté
				Si vous lisez cette page, <span class="text-success">vous êtes connecté</span>.</p>
				
				<security:authentication var="user" property="principal" />
				
				<p>Le fournisseur d'authentification va créer un objet Principal basé sur le <code>iss</code> et  <code>sub</code>
				associés à votre ID token. cette valeur peut être utilisée dans l'application comme nom d'utilisateur unique (identifiant technique non manipulé par un humain).
				Votre Principal est : <code>${ user }</code></p>

				<p>Le fournisseur d'authentification fournit uniquement les informations de connexion, les rôles sont déduits par l'application. Voici les rôles associés à votre compte:</p>
				
				<ul>
					<security:authentication property="authorities" var="authorities" />
					<c:forEach items="${authorities}" var="auth">
						<li><code>${ auth }</code></li>
					</c:forEach>
				</ul>
				
				<h3>ID Token</h3>

				<p>Votre ID token a les propriétés suivantes :</p>
				
				<security:authentication property="idTokenValue" var="idToken" />
				<table class="table table-striped table-hover" id="idTokenTable">
					<thead>
						<tr>
							<th>Nom</th>
							<th>Valeur</th>
						</tr>
					</thead>
					<tbody>
					</tbody>				
				</table>

				<h3>Info utilisateur</h3>
				
				<p>le service information utilisateur a renvoyé les informations suivantes</p>

				<table class="table table-striped table-hover" id="userInfoTable">
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
					</tbody>				
				</table>

			</div>

		</div>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function () {

		var idTokenString = "${ idToken }";
		var idToken = jwt.WebTokenParser.parse(idTokenString);
		var idClaims = JSON.parse(jwt.base64urldecode(idToken.payloadSegment));
	
		_.each(idClaims, function(val, key, list) {
			$('#idTokenTable tbody').append('<tr><td>' + _.escape(key) + '</td><td>' + _.escape(val) + '</td></tr>');
		});
		
		var userInfo = ${ userInfoJson };
		_.each(userInfo, function(val, key, list) {
			$('#userInfoTable tbody').append('<tr><td>' + _.escape(key) + '</td><td>' + _.escape(val) + '</td></tr>');
		});
	});

</script>
