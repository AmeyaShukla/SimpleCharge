[
		{
			"_id" : ObjectId("588990a90fa68519cb580267"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "8109191929"
		},
		{
			"_id" : ObjectId("588990d3e077ab19fc3e7e98"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "8109191929"
		},
		{
			"_id" : ObjectId("588992d6c870cb1e13d29165"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "8109191929"
		},
		{
			"_id" : ObjectId("588993291cd16b1f66af2904"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "7354042112"
		},
		{
			"_id" : ObjectId("588993e50748e0208904b89e"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "7354042112"
		},
		{
			"_id" : ObjectId("58899546c2121d21567fb956"),
			"recharge_date" : ISODate("2017-01-26T06:17:01Z"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "7354042112"
		},
		{
			"_id" : ObjectId("588998b6e47c8e23f83052f9"),
			"recharge_date" : ISODate("2017-01-26T06:17:01Z"),
			"recharge_amount" : "50",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "7354042112"
		},
		{
			"_id" : ObjectId("58899a3a68b52a27019cfe07"),
			"recharge_date" : ISODate("2017-01-26T06:17:01Z"),
			"recharge_amount" : "34",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "9940181302"
		},
		{
			"_id" : ObjectId("58899ce743ce422aac805995"),
			"recharge_date" : ISODate("2017-01-26T06:53:27.627Z"),
			"recharge_amount" : "34",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "9940181302"
		},
		{
			"_id" : ObjectId("58899cf843ce422aac805996"),
			"recharge_date" : ISODate("2017-01-26T06:53:44.440Z"),
			"recharge_amount" : "520",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "9940181302"
		},
		{
			"recharge_date" : ISODate("2017-01-26T07:28:38.513Z"),
			"_id" : ObjectId("5889a526d2d30a2e2e6d1354"),
			"recharge_amount" : "80",
			"recharge_status" : "pending",
			"recharge_type" : "Topup",
			"operator" : "Airtel",
			"phone_number" : "9940181302"
		}
]


http://mobilerechargeapi.in:8090/httpapi_r2/recharge-request?email=ameya.shukla4@gmail.com&api_key=32612008336&recharge_operator=1&recharge_circle=1&recharge_number=9940181302&amount=11&recharge_type=prepaid/mobile
{
  "_id": "58a8b28ebb7dd91b0df4f460",
  "status": "2",
  "message": "Success",
  "operator_id": "",
  "cr": 0.24,
  "dr": 8
}



Status Code: ‘1’ for SUCCESS ‘2’ for PENDING ‘3’ for FAILURE