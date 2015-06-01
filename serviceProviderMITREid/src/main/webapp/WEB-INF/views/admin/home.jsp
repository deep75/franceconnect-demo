<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<%@ page session="false" %>
<html>
<head>

<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Load jQuery up here so that we can use in-page functions -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/resources/jquery.js"></script>
    <script type="text/javascript">
    	// safely set the title of the application
    	function setPageTitle(title) {
    		document.title = "${config.topbarTitle} - " + title;
    	}
    	
		// get the info of the current user, if available (null otherwise)
    	function getUserInfo() {
    		return ${userInfoJson};
    	}
		
		// get the authorities of the current user, if available (null otherwise)
		function getUserAuthorities() {
			return ${userAuthorities};
		}
		
		// is the current user an admin?
		// NOTE: this is just for  
		function isAdmin() {
			var auth = getUserAuthorities();
			if (auth && _.contains(auth, "ROLE_ADMIN")) {
				return true;
			} else {
				return false;
			}
		}
    </script>   
</head>
<body>
<c:choose>
	<c:when test="${ not empty userInfo.preferredUsername }">
		<c:set var="shortName" value="${ userInfo.preferredUsername }" />
	</c:when>
	<c:otherwise>
		<c:set var="shortName" value="${ userInfo.sub }" />
	</c:otherwise>
</c:choose>
<c:choose>
	<c:when test="${ not empty userInfo.name }">
		<c:set var="longName" value="${ userInfo.name }" />
	</c:when>
	<c:otherwise>
		<c:choose>
			<c:when test="${ not empty userInfo.givenName || not empty userInfo.familyName }">
				<c:set var="longName" value="${ userInfo.givenName } {$ userInfo.familyName }" />
			</c:when>
			<c:otherwise>
				<c:set var="longName" value="${ shortName }" />
			</c:otherwise>
		</c:choose>
	</c:otherwise>
</c:choose>
<div class="navbar navbar-inverse">
	<div class="navbar-inner">
			<c:if test="${ not empty pageName }">
				<div class="nav-collapse collapse">
					<ul class="nav">
						<c:choose>
							<c:when test="${pageName == 'Home'}">
								<li class="active"><a href="#">Home</a></li>
							</c:when>
							<c:otherwise>
								<li><a href=".">Home</a></li>
							</c:otherwise>
						</c:choose>
						<c:choose>
							<c:when test="${pageName == 'User'}">
								<li class="active"><a href="#">User</a></li>
							</c:when>
							<c:otherwise>
								<li><a href="user">User</a></li>
							</c:otherwise>
						</c:choose>
						<c:choose>
							<c:when test="${pageName == 'Admin'}">
								<li class="active"><a href="#">Admin</a></li>
							</c:when>
							<c:otherwise>
								<li><a href="admin">Admin</a></li>
							</c:otherwise>
						</c:choose>
						<c:choose>
							<c:when test="${pageName == 'Logout'}">
								<li class="active"><a href="#">Logout</a></li>
							</c:when>
							<c:otherwise>
								<li><a href="${pageContext.request.contextPath}/j_spring_security_logout">Logout</a></li>
							</c:otherwise>
						</c:choose>
	
					</ul>
	            </div><!--/.nav-collapse -->
			</c:if>
        </div>
    </div>
</div>
<div class="container-fluid main">
	<div class="row-fluid">
		<div class="span10 offset1">

			<div>
				<p class="well">
					<security:authorize access="hasRole('ROLE_USER')">
						<b><span class="text-success">Vous êtes connecté !</span></b>
					</security:authorize>
					<security:authorize access="!hasRole('ROLE_USER')">
						<b><span class="text-error">Vous n'êtes <em>PAS</em> connecté.</span></b>			
					</security:authorize>
				</p>
				
				<p>Cette application de demo est configurée avec plusieurs pages nécessitant différents rôles. 
				Cette page ne nécessite pas d'être connecté.
				</p>
			
				<ul>
					<li><a href="user">User</a>, nécessite d'être connecté avec le rôle  <code>ROLE_USER</code> (Spring Security authority). Ce rôle est donné à toute personne connectée</li>
					<li><a href="admin">Admin</a>, nécessite d'être connecté avec le rôle <code>ROLE_ADMIN</code> (Spring Security authority). Ce rôle est donné uniquement aux personnes ayant le nom 'admin'</li>
					<security:authorize access="hasRole('ROLE_USER')">
						<li><a href="${pageContext.request.contextPath}/j_spring_security_logout">Déconnexion</a></li>
					</security:authorize>
					<security:authorize access="!hasRole('ROLE_USER')">
						<li><a href="${pageContext.request.contextPath}/admin/login" id="connexion">Connexion</a></li>
					</security:authorize>
				</ul>
			
			
			</div>
		
			<div>
				<h3>Client Filter Configuration</h3>
				
				<p>Information de configuration : </p>
				
				<ul>
					<li>Issuer service: <code>${ issuerServiceClass }</code></li>
					<li>Server configuration service: <code>${ serverConfigurationServiceClass }</code></li>
					<li>Client configuration service: <code>${ clientConfigurationServiceClass }</code></li>
					<li>Auth request options service: <code>${ authRequestOptionsServiceClass }</code></li>
					<li>Auth request URI builder: <code>${ authRequestUriBuilderClass }</code></li>
				</ul>
			</div>
			
		</div>
	</div>
</div>
</body>
</html>

