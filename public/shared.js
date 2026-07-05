const SCHEMA_SQL = "CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, first_name TEXT, country TEXT, segment TEXT, signup_date TEXT, acquisition_channel TEXT);\nCREATE TABLE products (product_id INTEGER PRIMARY KEY, product_name TEXT, category TEXT);\nCREATE TABLE transactions (transaction_id INTEGER PRIMARY KEY, customer_id INTEGER, product_id INTEGER, amount REAL, status TEXT, txn_date TEXT);\nCREATE TABLE events (event_id INTEGER PRIMARY KEY, customer_id INTEGER, event_type TEXT, event_date TEXT);\nCREATE TABLE campaign (customer_id INTEGER PRIMARY KEY, exp_group TEXT);\nINSERT INTO products VALUES (1,'Checkout','Payments'),\n (2,'P2P','Payments'),\n (3,'Credit','Credit'),\n (4,'Debit','Payments'),\n (5,'Xoom','Payments');\nINSERT INTO customers VALUES (1,'Ugo','UK','Consumer','2024-03-08','Referral'),\n (2,'Chiara','USA','Consumer','2024-03-20','Paid'),\n (3,'Luca','Italy','Consumer','2024-02-22','Paid'),\n (4,'Sami','France','Consumer','2024-04-13','Organic'),\n (5,'Elena','Spain','Consumer','2024-05-18','Organic'),\n (6,'Quinn','Spain','SMB','2024-01-22','Organic'),\n (7,'Yusuf','France','Consumer','2024-03-14','Organic'),\n (8,'Ines','Germany','Enterprise','2024-05-04','Organic'),\n (9,'Ugo','Germany','SMB','2024-02-12','Organic'),\n (10,'Dina','UK','SMB','2024-04-01','Paid'),\n (11,'Jack','Italy','Consumer','2024-06-03','Organic'),\n (12,'Rosa','Italy','Consumer','2024-04-18','Referral'),\n (13,'Giulia','Germany','Enterprise','2024-02-23','Referral'),\n (14,'Giulia','UK','Consumer','2024-04-12','Referral'),\n (15,'Ugo','France','Consumer','2024-04-24','Organic'),\n (16,'Maya','UK','Consumer','2024-01-13','Paid'),\n (17,'Chiara','UK','Consumer','2024-06-04','Referral'),\n (18,'Ugo','Germany','Consumer','2024-05-10','Referral'),\n (19,'Carlo','Italy','Consumer','2024-01-24','Organic'),\n (20,'Bea','UK','Consumer','2024-02-22','Organic'),\n (21,'Tara','France','Consumer','2024-02-26','Organic'),\n (22,'Ines','Italy','SMB','2024-01-04','Paid'),\n (23,'Kavya','USA','Consumer','2024-02-17','Paid'),\n (24,'David','USA','Consumer','2024-05-15','Organic'),\n (25,'Elena','USA','SMB','2024-05-20','Referral'),\n (26,'Ugo','Italy','Consumer','2024-01-23','Paid'),\n (27,'Alice','USA','Consumer','2024-04-24','Referral'),\n (28,'Rosa','UK','Consumer','2024-06-22','Referral'),\n (29,'Yusuf','USA','Consumer','2024-03-27','Paid'),\n (30,'David','France','Enterprise','2024-06-26','Paid'),\n (31,'Will','Italy','Consumer','2024-05-21','Organic'),\n (32,'Kavya','Spain','SMB','2024-03-18','Referral'),\n (33,'Jack','Spain','Consumer','2024-02-11','Organic'),\n (34,'Giulia','Italy','SMB','2024-03-24','Paid'),\n (35,'Bea','USA','Consumer','2024-04-16','Organic'),\n (36,'Xena','UK','Enterprise','2024-02-09','Organic'),\n (37,'Vera','Italy','Consumer','2024-05-08','Organic'),\n (38,'Frank','Spain','SMB','2024-06-10','Referral'),\n (39,'Hassan','France','Enterprise','2024-06-01','Referral'),\n (40,'Ines','Germany','Consumer','2024-04-17','Organic'),\n (41,'Quinn','UK','SMB','2024-04-14','Referral'),\n (42,'Dina','Germany','SMB','2024-02-28','Referral'),\n (43,'Ugo','Italy','Consumer','2024-02-17','Organic'),\n (44,'David','USA','Consumer','2024-04-01','Referral'),\n (45,'Chiara','USA','Enterprise','2024-03-20','Paid'),\n (46,'Dina','Germany','Consumer','2024-04-21','Organic'),\n (47,'David','Italy','Consumer','2024-03-19','Referral'),\n (48,'Jack','Spain','SMB','2024-02-07','Paid'),\n (49,'Quinn','Spain','Enterprise','2024-03-27','Organic'),\n (50,'Jack','France','Enterprise','2024-01-15','Paid'),\n (51,'Hassan','France','SMB','2024-04-28','Referral'),\n (52,'Luca','UK','SMB','2024-04-01','Organic'),\n (53,'Aldo','USA','SMB','2024-03-02','Paid'),\n (54,'Zara','Italy','Consumer','2024-01-05','Referral'),\n (55,'Quinn','Spain','Consumer','2024-01-02','Referral'),\n (56,'Nora','France','Consumer','2024-04-03','Paid'),\n (57,'Elena','UK','Consumer','2024-06-21','Paid'),\n (58,'Kavya','USA','Consumer','2024-01-11','Paid'),\n (59,'Hassan','USA','Enterprise','2024-06-20','Referral'),\n (60,'Kavya','Spain','Consumer','2024-02-19','Organic');\nINSERT INTO events VALUES (1,1,'signup','2024-03-08'),\n (2,1,'activated','2024-03-20'),\n (3,1,'first_payment','2024-04-01'),\n (4,1,'repeat_payment','2024-05-15'),\n (5,2,'signup','2024-03-20'),\n (6,2,'activated','2024-03-21'),\n (7,2,'first_payment','2024-03-30'),\n (8,2,'repeat_payment','2024-05-03'),\n (9,3,'signup','2024-02-22'),\n (10,3,'activated','2024-03-04'),\n (11,3,'first_payment','2024-03-14'),\n (12,3,'repeat_payment','2024-04-05'),\n (13,4,'signup','2024-04-13'),\n (14,5,'signup','2024-05-18'),\n (15,5,'activated','2024-05-28'),\n (16,5,'first_payment','2024-06-07'),\n (17,5,'repeat_payment','2024-07-16'),\n (18,6,'signup','2024-01-22'),\n (19,7,'signup','2024-03-14'),\n (20,7,'activated','2024-03-15'),\n (21,8,'signup','2024-05-04'),\n (22,9,'signup','2024-02-12'),\n (23,9,'activated','2024-02-21'),\n (24,10,'signup','2024-04-01'),\n (25,10,'activated','2024-04-07'),\n (26,11,'signup','2024-06-03'),\n (27,11,'activated','2024-06-11'),\n (28,12,'signup','2024-04-18'),\n (29,12,'activated','2024-04-27'),\n (30,13,'signup','2024-02-23'),\n (31,13,'activated','2024-03-05'),\n (32,13,'first_payment','2024-03-13'),\n (33,13,'repeat_payment','2024-04-17'),\n (34,14,'signup','2024-04-12'),\n (35,14,'activated','2024-04-20'),\n (36,15,'signup','2024-04-24'),\n (37,15,'activated','2024-04-26'),\n (38,15,'first_payment','2024-04-30'),\n (39,15,'repeat_payment','2024-06-04'),\n (40,16,'signup','2024-01-13'),\n (41,16,'activated','2024-01-21'),\n (42,16,'first_payment','2024-02-02'),\n (43,16,'repeat_payment','2024-03-22'),\n (44,17,'signup','2024-06-04'),\n (45,17,'activated','2024-06-08'),\n (46,17,'first_payment','2024-06-11'),\n (47,18,'signup','2024-05-10'),\n (48,19,'signup','2024-01-24'),\n (49,19,'activated','2024-01-29'),\n (50,19,'first_payment','2024-02-02'),\n (51,20,'signup','2024-02-22'),\n (52,20,'activated','2024-03-02'),\n (53,21,'signup','2024-02-26'),\n (54,21,'activated','2024-03-04'),\n (55,21,'first_payment','2024-03-16'),\n (56,21,'repeat_payment','2024-04-05'),\n (57,22,'signup','2024-01-04'),\n (58,22,'activated','2024-01-10'),\n (59,22,'first_payment','2024-01-16'),\n (60,23,'signup','2024-02-17'),\n (61,23,'activated','2024-02-29'),\n (62,23,'first_payment','2024-03-02'),\n (63,24,'signup','2024-05-15'),\n (64,24,'activated','2024-05-19'),\n (65,25,'signup','2024-05-20'),\n (66,25,'activated','2024-05-28'),\n (67,25,'first_payment','2024-06-09'),\n (68,26,'signup','2024-01-23'),\n (69,26,'activated','2024-01-28'),\n (70,26,'first_payment','2024-02-12'),\n (71,26,'repeat_payment','2024-03-11'),\n (72,27,'signup','2024-04-24'),\n (73,27,'activated','2024-05-02'),\n (74,28,'signup','2024-06-22'),\n (75,28,'activated','2024-07-03'),\n (76,28,'first_payment','2024-07-17'),\n (77,28,'repeat_payment','2024-08-20'),\n (78,29,'signup','2024-03-27'),\n (79,29,'activated','2024-03-28'),\n (80,29,'first_payment','2024-03-29'),\n (81,29,'repeat_payment','2024-05-14'),\n (82,30,'signup','2024-06-26'),\n (83,30,'activated','2024-07-06'),\n (84,30,'first_payment','2024-07-12'),\n (85,31,'signup','2024-05-21'),\n (86,31,'activated','2024-05-30'),\n (87,31,'first_payment','2024-06-07'),\n (88,31,'repeat_payment','2024-07-08'),\n (89,32,'signup','2024-03-18'),\n (90,32,'activated','2024-03-22'),\n (91,32,'first_payment','2024-04-03'),\n (92,32,'repeat_payment','2024-05-15'),\n (93,33,'signup','2024-02-11'),\n (94,33,'activated','2024-02-20'),\n (95,34,'signup','2024-03-24'),\n (96,34,'activated','2024-04-02'),\n (97,34,'first_payment','2024-04-04'),\n (98,34,'repeat_payment','2024-05-24'),\n (99,35,'signup','2024-04-16'),\n (100,35,'activated','2024-04-27'),\n (101,35,'first_payment','2024-04-30'),\n (102,36,'signup','2024-02-09'),\n (103,36,'activated','2024-02-12'),\n (104,36,'first_payment','2024-02-21'),\n (105,36,'repeat_payment','2024-04-06'),\n (106,37,'signup','2024-05-08'),\n (107,37,'activated','2024-05-13'),\n (108,38,'signup','2024-06-10'),\n (109,38,'activated','2024-06-18'),\n (110,38,'first_payment','2024-06-30'),\n (111,39,'signup','2024-06-01'),\n (112,40,'signup','2024-04-17'),\n (113,40,'activated','2024-04-22'),\n (114,40,'first_payment','2024-05-02'),\n (115,40,'repeat_payment','2024-06-15'),\n (116,41,'signup','2024-04-14'),\n (117,41,'activated','2024-04-23'),\n (118,41,'first_payment','2024-05-06'),\n (119,41,'repeat_payment','2024-05-30'),\n (120,42,'signup','2024-02-28'),\n (121,42,'activated','2024-03-06'),\n (122,42,'first_payment','2024-03-19'),\n (123,42,'repeat_payment','2024-04-29'),\n (124,43,'signup','2024-02-17'),\n (125,44,'signup','2024-04-01'),\n (126,44,'activated','2024-04-08'),\n (127,45,'signup','2024-03-20'),\n (128,45,'activated','2024-03-31'),\n (129,45,'first_payment','2024-04-06'),\n (130,46,'signup','2024-04-21'),\n (131,46,'activated','2024-04-26'),\n (132,46,'first_payment','2024-05-11'),\n (133,47,'signup','2024-03-19'),\n (134,47,'activated','2024-03-31'),\n (135,47,'first_payment','2024-04-14'),\n (136,48,'signup','2024-02-07'),\n (137,48,'activated','2024-02-16'),\n (138,49,'signup','2024-03-27'),\n (139,50,'signup','2024-01-15'),\n (140,51,'signup','2024-04-28'),\n (141,51,'activated','2024-05-04'),\n (142,51,'first_payment','2024-05-11'),\n (143,52,'signup','2024-04-01'),\n (144,52,'activated','2024-04-10'),\n (145,52,'first_payment','2024-04-20'),\n (146,53,'signup','2024-03-02'),\n (147,53,'activated','2024-03-06'),\n (148,53,'first_payment','2024-03-10'),\n (149,54,'signup','2024-01-05'),\n (150,54,'activated','2024-01-09'),\n (151,54,'first_payment','2024-01-10'),\n (152,55,'signup','2024-01-02'),\n (153,56,'signup','2024-04-03'),\n (154,57,'signup','2024-06-21'),\n (155,57,'activated','2024-07-03'),\n (156,57,'first_payment','2024-07-13'),\n (157,57,'repeat_payment','2024-08-30'),\n (158,58,'signup','2024-01-11'),\n (159,58,'activated','2024-01-22'),\n (160,58,'first_payment','2024-01-25'),\n (161,58,'repeat_payment','2024-03-09'),\n (162,59,'signup','2024-06-20'),\n (163,59,'activated','2024-06-29'),\n (164,59,'first_payment','2024-07-14'),\n (165,60,'signup','2024-02-19'),\n (166,60,'activated','2024-02-21'),\n (167,60,'first_payment','2024-03-03');\nINSERT INTO transactions VALUES (1,1,5,38.05,'completed','2024-05-03'),\n (2,1,5,181.54,'completed','2024-06-09'),\n (3,1,5,89.52,'completed','2024-07-18'),\n (4,1,5,218.5,'completed','2024-07-23'),\n (5,2,1,56.5,'completed','2024-04-16'),\n (6,2,1,347.91,'failed','2024-05-09'),\n (7,3,4,79.27,'completed','2024-04-12'),\n (8,3,2,85.31,'completed','2024-05-22'),\n (9,3,2,100.4,'completed','2024-05-30'),\n (10,5,2,93.14,'failed','2024-07-13'),\n (11,5,3,365.98,'completed','2024-07-27'),\n (12,13,1,251.79,'completed','2024-04-08'),\n (13,13,1,65.56,'completed','2024-04-27'),\n (14,13,1,365.95,'completed','2024-05-16'),\n (15,13,2,40.63,'completed','2024-05-25'),\n (16,13,2,89.57,'failed','2024-07-03'),\n (17,15,4,71.21,'completed','2024-06-03'),\n (18,15,2,15.56,'refunded','2024-07-13'),\n (19,15,2,111.9,'completed','2024-07-18'),\n (20,16,2,92.28,'completed','2024-02-10'),\n (21,16,5,45.36,'completed','2024-03-16'),\n (22,16,2,75.45,'completed','2024-04-01'),\n (23,16,1,83.16,'failed','2024-04-21'),\n (24,16,2,78.13,'completed','2024-05-11'),\n (25,16,4,75.43,'completed','2024-06-18'),\n (26,16,5,101.72,'completed','2024-07-13'),\n (27,17,2,27.35,'completed','2024-07-09'),\n (28,19,3,274.6,'completed','2024-02-23'),\n (29,19,3,154.79,'completed','2024-03-16'),\n (30,19,3,1150.66,'completed','2024-04-06'),\n (31,19,3,301.03,'refunded','2024-05-08'),\n (32,19,3,1276.7,'completed','2024-05-22'),\n (33,19,4,18.92,'completed','2024-06-05'),\n (34,21,2,104.45,'completed','2024-04-14'),\n (35,21,1,149.87,'completed','2024-05-18'),\n (36,21,3,181.95,'completed','2024-06-06'),\n (37,21,1,351.17,'refunded','2024-07-02'),\n (38,21,1,270.93,'completed','2024-07-24'),\n (39,22,4,13.11,'completed','2024-02-02'),\n (40,22,4,35.5,'completed','2024-03-11'),\n (41,22,4,56.44,'completed','2024-04-06'),\n (42,22,4,56.68,'completed','2024-04-30'),\n (43,22,4,23.43,'completed','2024-05-23'),\n (44,22,4,53.09,'completed','2024-06-21'),\n (45,22,4,31.27,'completed','2024-07-31'),\n (46,23,1,330.36,'completed','2024-03-26'),\n (47,23,1,394.22,'completed','2024-04-02'),\n (48,23,2,55.59,'completed','2024-04-11'),\n (49,23,3,1090.08,'completed','2024-04-28'),\n (50,23,1,276.18,'completed','2024-05-18'),\n (51,25,1,310.64,'completed','2024-07-12'),\n (52,26,2,52.13,'completed','2024-02-26'),\n (53,26,2,55.64,'completed','2024-03-15'),\n (54,26,2,16.85,'completed','2024-04-18'),\n (55,26,2,104.24,'completed','2024-05-17'),\n (56,26,2,10.65,'completed','2024-06-15'),\n (57,26,2,69.2,'completed','2024-07-14'),\n (58,29,1,111.77,'completed','2024-04-04'),\n (59,29,1,85.44,'completed','2024-04-18'),\n (60,29,5,218.86,'completed','2024-05-06'),\n (61,29,1,320.01,'completed','2024-05-21'),\n (62,29,1,248.33,'failed','2024-06-14'),\n (63,29,5,284.2,'completed','2024-07-13'),\n (64,30,2,100.46,'completed','2024-07-17'),\n (65,31,2,36.82,'completed','2024-06-29'),\n (66,31,2,13.16,'completed','2024-07-28'),\n (67,32,4,65.51,'completed','2024-05-09'),\n (68,32,4,58.43,'completed','2024-05-28'),\n (69,32,4,48.74,'completed','2024-06-25'),\n (70,34,2,87.88,'completed','2024-04-28'),\n (71,34,2,70.87,'completed','2024-05-05'),\n (72,34,1,352.65,'completed','2024-05-18'),\n (73,34,1,142.36,'completed','2024-05-23'),\n (74,35,2,76.69,'completed','2024-06-09'),\n (75,35,5,132.7,'failed','2024-06-28'),\n (76,35,5,297.31,'completed','2024-07-22'),\n (77,36,4,30.39,'completed','2024-03-25'),\n (78,36,4,14.98,'completed','2024-04-17'),\n (79,38,2,14.38,'completed','2024-07-10'),\n (80,40,2,83.71,'completed','2024-05-28'),\n (81,40,3,1086.46,'completed','2024-06-23'),\n (82,40,1,203.74,'completed','2024-07-23'),\n (83,41,5,267.83,'completed','2024-05-29'),\n (84,41,2,88.08,'completed','2024-06-04'),\n (85,41,5,55.17,'refunded','2024-06-09'),\n (86,41,5,285.71,'completed','2024-06-21'),\n (87,41,5,281.82,'completed','2024-07-05'),\n (88,41,5,255.38,'refunded','2024-07-27'),\n (89,42,4,50.59,'completed','2024-04-12'),\n (90,42,3,877.08,'completed','2024-04-26'),\n (91,42,4,36.4,'refunded','2024-06-05'),\n (92,42,4,26.72,'completed','2024-06-22'),\n (93,42,1,154.54,'completed','2024-07-23'),\n (94,45,4,54.18,'failed','2024-04-15'),\n (95,45,3,735.86,'completed','2024-05-04'),\n (96,45,1,99.89,'completed','2024-05-15'),\n (97,45,3,587.91,'completed','2024-05-21'),\n (98,45,5,146.29,'completed','2024-06-17'),\n (99,45,4,21.9,'completed','2024-07-18'),\n (100,46,2,118.64,'completed','2024-06-13'),\n (101,46,1,130.04,'completed','2024-07-15'),\n (102,47,5,239.45,'completed','2024-05-20'),\n (103,47,1,269.18,'completed','2024-06-16'),\n (104,47,3,281.17,'completed','2024-06-29'),\n (105,47,5,242.92,'completed','2024-07-06'),\n (106,51,2,92.39,'completed','2024-06-08'),\n (107,52,4,18.17,'completed','2024-05-14'),\n (108,52,4,79.71,'completed','2024-05-21'),\n (109,52,4,37.21,'completed','2024-06-10'),\n (110,52,4,51.11,'completed','2024-07-19'),\n (111,53,3,231.74,'completed','2024-04-18'),\n (112,53,3,273.76,'completed','2024-04-30'),\n (113,53,3,1212.17,'completed','2024-05-06'),\n (114,53,3,242.62,'completed','2024-05-19'),\n (115,53,3,1247.62,'completed','2024-06-06'),\n (116,53,3,524.32,'refunded','2024-06-20'),\n (117,54,3,303.43,'completed','2024-02-10'),\n (118,54,2,66.46,'completed','2024-03-14'),\n (119,54,1,380.35,'completed','2024-04-20'),\n (120,57,1,274.33,'completed','2024-07-25'),\n (121,58,1,195.48,'completed','2024-02-04'),\n (122,58,1,240.29,'completed','2024-03-03'),\n (123,58,1,281.2,'completed','2024-04-12'),\n (124,58,1,388.62,'completed','2024-05-14'),\n (125,58,1,248.05,'completed','2024-06-10'),\n (126,58,1,345.02,'completed','2024-07-15'),\n (127,60,5,143.35,'completed','2024-03-21'),\n (128,26,5,60.73,'completed','2024-04-29'),\n (129,26,1,141.97,'completed','2024-05-27'),\n (130,32,1,119.39,'completed','2024-05-11'),\n (131,32,1,42.77,'completed','2024-06-17'),\n (132,32,2,94.41,'completed','2024-05-10'),\n (133,38,4,22.3,'completed','2024-07-06'),\n (134,38,5,219.99,'completed','2024-05-20'),\n (135,45,4,11.31,'completed','2024-04-07'),\n (136,45,3,927.27,'completed','2024-04-11'),\n (137,45,4,59.66,'completed','2024-06-14'),\n (138,47,1,387.83,'completed','2024-05-23'),\n (139,58,1,127.59,'completed','2024-07-19'),\n (140,58,4,46.68,'completed','2024-06-16');\nINSERT INTO campaign VALUES (1,'treatment'),\n (2,'control'),\n (3,'treatment'),\n (4,'control'),\n (5,'control'),\n (6,'control'),\n (7,'control'),\n (8,'treatment'),\n (9,'control'),\n (10,'control'),\n (11,'control'),\n (12,'treatment'),\n (13,'control'),\n (14,'treatment'),\n (15,'treatment'),\n (16,'control'),\n (17,'control'),\n (18,'treatment'),\n (19,'control'),\n (20,'treatment'),\n (21,'treatment'),\n (22,'control'),\n (23,'control'),\n (24,'treatment'),\n (25,'control'),\n (26,'treatment'),\n (27,'control'),\n (28,'treatment'),\n (29,'control'),\n (30,'control'),\n (31,'control'),\n (32,'treatment'),\n (33,'control'),\n (34,'treatment'),\n (35,'control'),\n (36,'control'),\n (37,'treatment'),\n (38,'treatment'),\n (39,'control'),\n (40,'treatment'),\n (41,'treatment'),\n (42,'control'),\n (43,'treatment'),\n (44,'control'),\n (45,'treatment'),\n (46,'control'),\n (47,'treatment'),\n (48,'treatment'),\n (49,'control'),\n (50,'treatment'),\n (51,'control'),\n (52,'control'),\n (53,'control'),\n (54,'control'),\n (55,'control'),\n (56,'treatment'),\n (57,'treatment'),\n (58,'treatment'),\n (59,'treatment'),\n (60,'control');\n";

let db=null;

const SCHEMA_VIEW=[
 {name:"customers",cols:[["customer_id","int"],["first_name","text"],["country","text"],["segment","text"],["signup_date","date"],["acquisition_channel","text"]]},
 {name:"products",cols:[["product_id","int"],["product_name","text"],["category","text"]]},
 {name:"transactions",cols:[["transaction_id","int"],["customer_id","int"],["product_id","int"],["amount","real"],["status","text"],["txn_date","date"]]},
 {name:"events",cols:[["event_id","int"],["customer_id","int"],["event_type","text"],["event_date","date"]]},
 {name:"campaign",cols:[["customer_id","int"],["exp_group","text"]]},
];

function normCell(v){
  if(v===null||v===undefined) return "\u2205NULL";
  if(typeof v==="number") return (Math.round(v*100)/100).toFixed(2);
  return String(v).trim();
}
function runSQL(sql){const r=db.exec(sql);if(!r.length)return{columns:[],values:[]};return r[r.length-1];}
function rowsKey(res,ordered){const rows=res.values.map(r=>JSON.stringify(r.map(normCell)));if(!ordered)rows.sort();return rows;}
function grade(u,s,ordered){
  if(u.columns.length!==s.columns.length) return {ok:false,msg:"Expected "+s.columns.length+" column(s), your query returned "+u.columns.length+"."};
  if(u.values.length!==s.values.length) return {ok:false,msg:"Expected "+s.values.length+" row(s), your query returned "+u.values.length+"."};
  const a=rowsKey(u,ordered),b=rowsKey(s,ordered);
  for(let i=0;i<a.length;i++) if(a[i]!==b[i]) return {ok:false,msg:ordered?"Right count, but order or values differ. Check your ORDER BY and the values.":"Right shape, but some values do not match. Compare against the solution."};
  return {ok:true,msg:"Result matches the expected output."};
}

function buildSchema(){
  let html='<h3>Dataset schema</h3><p class="note">A simulated PayPal consumer-growth dataset: 60 customers across signup cohorts, a signup to repeat-payment event funnel, 140 transactions across five products, and a treatment/control campaign flag for causal work.</p><div class="tables">';
  SCHEMA_VIEW.forEach(t=>{html+='<div class="tbl"><div class="name">'+t.name+'</div><ul>';t.cols.forEach(c=>{html+='<li><b>'+c[0]+'</b><span class="ty">'+c[1]+'</span></li>';});html+='</ul></div>';});
  return html+'</div>';
}

function getEffectiveTheme(){
  const saved=localStorage.getItem("theme");
  if(saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyThemeIcon(){
  const btn=document.getElementById("themeToggle");
  if(!btn) return;
  btn.textContent = getEffectiveTheme()==="dark" ? "☀️" : "🌙";
}
function initThemeToggle(){
  applyThemeIcon();
  const btn=document.getElementById("themeToggle");
  if(!btn) return;
  btn.addEventListener("click",()=>{
    const next = getEffectiveTheme()==="dark" ? "light" : "dark";
    localStorage.setItem("theme",next);
    document.documentElement.setAttribute("data-theme",next);
    applyThemeIcon();
  });
}

function initTrainerSelect(){
  const sel=document.getElementById("trainerSelect");
  if(!sel) return;
  sel.addEventListener("change",()=>{window.location.href=sel.value;});
}

function syncHeaderHeight(){
  const h=document.querySelector("header");
  if(!h)return;
  document.documentElement.style.setProperty("--header-h",h.offsetHeight+"px");
}

const QUESTION_TIME_BUDGET={easy:180,medium:360,hard:600};
function estimateLabel(diff){return "~"+Math.round((QUESTION_TIME_BUDGET[diff]||360)/60)+" min";}
let questionTimerInterval=null,questionTimerSeconds=0;
function startQuestionTimer(diff){
  clearInterval(questionTimerInterval);
  questionTimerSeconds=0;
  renderQuestionTimer(diff);
  questionTimerInterval=setInterval(()=>{questionTimerSeconds++;renderQuestionTimer(diff);},1000);
}
function renderQuestionTimer(diff){
  const budget=QUESTION_TIME_BUDGET[diff]||360;
  const m=Math.floor(questionTimerSeconds/60),s=questionTimerSeconds%60;
  const text=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  let cls="qtimer";
  if(questionTimerSeconds>budget*2)cls+=" over";
  else if(questionTimerSeconds>budget)cls+=" warn";
  ["qtimerMain","qtimerScrolled"].forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.textContent=text;
    el.className=cls+(id==="qtimerScrolled"?" qtimer-scrolled":"");
  });
}

async function requestExplanation(payload){
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(!session) throw new Error("Sign in to use explanations.");
  const res=await fetch("/api/explain",{
    method:"POST",
    headers:{"content-type":"application/json","authorization":"Bearer "+session.access_token},
    body:JSON.stringify(payload)
  });
  const j=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(j.error||"Explanation failed - try again.");
  return j;
}
function getExplainModel(){
  return localStorage.getItem("explainModel")||"sonnet";
}
function initExplainModelSelect(){
  const sel=document.getElementById("explainModel");
  if(!sel) return;
  sel.value=getExplainModel();
  sel.addEventListener("change",()=>localStorage.setItem("explainModel",sel.value));
}
function setExplainWrongVisible(show){
  const btn=document.getElementById("explainWrongBtn");
  if(btn) btn.style.display=show?"":"none";
}

function mdEscape(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function mdInline(s){
  s=s.replace(/`([^`]+)`/g,"<code>$1</code>");
  s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
  s=s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g,"$1<em>$2</em>");
  s=s.replace(/(^|[^_])_([^_\n]+)_(?!_)/g,"$1<em>$2</em>");
  return s;
}
function renderMarkdown(raw){
  const lines=mdEscape(raw||"").split("\n");
  let html="",inCode=false,codeBuf=[],listType=null,listBuf=[],paraBuf=[];
  function flushPara(){if(paraBuf.length){html+="<p>"+mdInline(paraBuf.join(" "))+"</p>";paraBuf=[];}}
  function flushList(){
    if(listType&&listBuf.length) html+="<"+listType+">"+listBuf.map(li=>"<li>"+mdInline(li)+"</li>").join("")+"</"+listType+">";
    listType=null;listBuf=[];
  }
  lines.forEach(line=>{
    if(/^```/.test(line)){
      if(inCode){html+="<pre><code>"+codeBuf.join("\n")+"</code></pre>";codeBuf=[];inCode=false;}
      else{flushPara();flushList();inCode=true;}
      return;
    }
    if(inCode){codeBuf.push(line);return;}
    if(!line.trim()){flushPara();flushList();return;}
    const h=line.match(/^(#{1,4})\s+(.*)/);
    if(h){flushPara();flushList();const lvl=Math.min(h[1].length+3,6);html+="<h"+lvl+">"+mdInline(h[2])+"</h"+lvl+">";return;}
    const ol=line.match(/^\s*\d+[.)]\s+(.*)/);
    if(ol){flushPara();if(listType!=="ol"){flushList();listType="ol";}listBuf.push(ol[1]);return;}
    const ul=line.match(/^\s*[-*]\s+(.*)/);
    if(ul){flushPara();if(listType!=="ul"){flushList();listType="ul";}listBuf.push(ul[1]);return;}
    flushList();
    paraBuf.push(line.trim());
  });
  flushPara();flushList();
  if(inCode&&codeBuf.length) html+="<pre><code>"+codeBuf.join("\n")+"</code></pre>";
  return html||"<p></p>";
}

function initShellLayout(){
  const wrap=document.querySelector(".wrap");
  const aside=document.getElementById("sidebar");
  const main=document.querySelector("main");
  const right=document.getElementById("rightCol");
  const resizer=document.getElementById("colResizer");
  if(!wrap||!aside||!main||!right) return;

  const toggle=document.getElementById("sidebarToggle");
  const toggleScrolled=document.getElementById("sidebarToggleScrolled");
  if(!toggle) return;

  const mq=window.matchMedia("(min-width:861px)");
  const MIN_PCT=22,MAX_PCT=65,DEFAULT_PCT=40;

  function moveEditor(toRight){
    const ask=document.getElementById("ask");
    const promptBox=document.getElementById("promptBox");
    const editor=document.querySelector(".editor-wrap");
    const actions=document.querySelector(".actions");
    const verdict=document.getElementById("verdict");
    const order=[ask,promptBox,editor,actions];
    if(toRight){
      order.forEach(el=>{if(el)right.appendChild(el);});
    }else{
      order.forEach(el=>{
        if(!el) return;
        if(verdict) main.insertBefore(el,verdict);
        else main.appendChild(el);
      });
    }
  }

  function applyColumnRatio(){
    if(!mq.matches){
      main.style.flex="";
      right.style.flex="";
      return;
    }
    const pct=Math.min(MAX_PCT,Math.max(MIN_PCT,parseFloat(localStorage.getItem("colSplitPct"))||DEFAULT_PCT));
    right.style.flex="0 0 "+pct+"%";
    main.style.flex="1 1 0%";
  }

  function initResizer(){
    if(!resizer) return;
    let startX=0,startPct=DEFAULT_PCT,containerWidth=0;
    function onMove(e){
      const x=e.touches?e.touches[0].clientX:e.clientX;
      const deltaPct=((startX-x)/containerWidth)*100;
      const pct=Math.min(MAX_PCT,Math.max(MIN_PCT,startPct+deltaPct));
      right.style.flex="0 0 "+pct+"%";
      main.style.flex="1 1 0%";
      localStorage.setItem("colSplitPct",String(pct));
    }
    function onUp(){
      document.body.classList.remove("col-resizing");
      resizer.classList.remove("dragging");
      document.removeEventListener("mousemove",onMove);
      document.removeEventListener("mouseup",onUp);
      document.removeEventListener("touchmove",onMove);
      document.removeEventListener("touchend",onUp);
      syncHeaderHeight();
    }
    function onDown(e){
      if(!mq.matches) return;
      const x=e.touches?e.touches[0].clientX:e.clientX;
      startX=x;
      containerWidth=main.getBoundingClientRect().width+right.getBoundingClientRect().width+resizer.getBoundingClientRect().width;
      startPct=Math.min(MAX_PCT,Math.max(MIN_PCT,parseFloat(localStorage.getItem("colSplitPct"))||DEFAULT_PCT));
      document.body.classList.add("col-resizing");
      resizer.classList.add("dragging");
      document.addEventListener("mousemove",onMove);
      document.addEventListener("mouseup",onUp);
      document.addEventListener("touchmove",onMove,{passive:false});
      document.addEventListener("touchend",onUp);
      e.preventDefault();
    }
    resizer.addEventListener("mousedown",onDown);
    resizer.addEventListener("touchstart",onDown,{passive:false});
  }

  function apply(){
    const collapsed=wrap.classList.contains("sidebar-collapsed");
    const label=collapsed?"Show topic list":"Hide topic list";
    toggle.textContent=collapsed?"› Show list":"‹ Hide list";
    toggle.setAttribute("aria-label",label);
    if(toggleScrolled){
      toggleScrolled.textContent=collapsed?"›":"‹";
      toggleScrolled.setAttribute("aria-label",label);
    }
    moveEditor(mq.matches);
    applyColumnRatio();
    syncHeaderHeight();
  }

  function toggleSidebar(){
    const collapsed=!wrap.classList.contains("sidebar-collapsed");
    wrap.classList.toggle("sidebar-collapsed",collapsed);
    localStorage.setItem("sidebarCollapsed",collapsed?"1":"0");
    apply();
  }

  toggle.addEventListener("click",toggleSidebar);
  if(toggleScrolled) toggleScrolled.addEventListener("click",toggleSidebar);
  mq.addEventListener("change",apply);
  initResizer();

  wrap.classList.toggle("sidebar-collapsed",localStorage.getItem("sidebarCollapsed")==="1");
  apply();
}
