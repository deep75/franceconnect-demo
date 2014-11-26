<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<html>
 <head>
<meta charset="utf-8">
 <title>Demo France connect</title>
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
	<script src="${pageContext.request.contextPath}/resources/jwt.js"></script>
	<script src="${pageContext.request.contextPath}/resources/underscore.js"></script>
	<script src="${pageContext.request.contextPath}/resources/jquery/jquery-ui.min.js"></script>
	
	<script src="${pageContext.request.contextPath}/resources/bootstrap/js/bootstrap.min.js"></script>
	<style type="text/css">
.customLogo img {
  height: 50px; !important
}
	</style>
 <sitemesh:write property='head'/>
 
 </head>
 
 <body>
   <!-- Fixed navbar header -->
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="navbar-inner">
      <div class="container">
		<!-- LOGO du MCC -->
        <div class="navbar-header">
			<a class="customLogo" href="#"><img alt="logo Minist�re de la culture et de la Communication" src="${pageContext.request.contextPath}/resources/logo_mcc.jpg"></a>
        </div>
		<!-- Nom de l'application -->
        <div class="navbar-header">
     		   <a class="navbar-brand" href="${pageContext.request.contextPath}/">Demo France connect</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" id="admin">Admin <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="${pageContext.request.contextPath}/admin/" id="accesRestreint">Acces restreint</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Consultation <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="${pageContext.request.contextPath}/view/">Acces ouvert � tous</a></li>
              </ul>
            </li>
          </ul>
          <security:authorize access="hasRole('ROLE_USER')">
   		   <a class="navbar-brand" href="${pageContext.request.contextPath}/j_spring_security_logout">D�connexion</a>
   		   </security:authorize>
        </div><!--/.nav-collapse -->
      </div>
    </div>
  </div>

 
 <sitemesh:write property='body'/>
 </body>
</html>