-- Last Edited 2/11/22 14.00

-- IPAQET3

SELECT status_ipaqet3.*,mc_name.Name,mc_name.Type
FROM status_log_info_ipaqet3 as status_ipaqet3
JOIN mc_name ON status_ipaqet3.MC_NameID = mc_name.No 
GROUP BY mc_name.Name 
ORDER BY status_ipaqet3.ID DESC

--

-- NET100

SELECT status_net100.*,mc_name.Name,mc_name.Type,code.STATUS_NAME 
FROM status_log_info_net100 as status_net100 
JOIN mc_name ON status_net100.MC_NameID = mc_name.No 
JOIN status_code_net100 AS code ON status_net100.STATUS_CODE = code.STATUS_CODE WHERE status_net100.ID  
IN( 
	SELECT max(status_net100.ID) 
	FROM status_log_info_net100 as status_net100 
	GROUP BY status_net100.MC_NameID
)

--

-- END