{
	"version":"LAYASCENE3D:02",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"Car0402",
			"ambientColor":[
				0.212,
				0.227,
				0.259
			],
			"lightmaps":[],
			"enableFog":false,
			"fogStart":0,
			"fogRange":300,
			"fogColor":[
				0.5,
				0.5,
				0.5
			]
		},
		"child":[
			{
				"type":"Camera",
				"instanceID":0,
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						1.1,
						-16.27
					],
					"rotation":[
						0,
						0.9990483,
						0.04361941,
						0
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":1,
					"orthographic":false,
					"orthographicVerticalSize":10,
					"fieldOfView":60,
					"enableHDR":true,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						0.1921569,
						0.3019608,
						0.4745098,
						0
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"DirectionLight",
				"instanceID":1,
				"props":{
					"name":"Directional Light",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						-3.76,
						11.96,
						-6.51
					],
					"rotation":[
						0.1449476,
						0.8002398,
						0.5409519,
						-0.2144236
					],
					"scale":[
						1,
						1,
						1
					],
					"intensity":1,
					"lightmapBakedType":0,
					"color":[
						1,
						0.9568627,
						0.8392157
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"MeshSprite3D",
				"instanceID":2,
				"props":{
					"name":"Runway",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						0,
						0
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						3.3,
						0.3,
						32
					],
					"meshPath":"Library/unity default resources-Cube.lm",
					"enableRender":true,
					"materials":[
						{
							"path":"Assets/Material/Plane.lmat"
						}
					]
				},
				"components":[
					{
						"type":"PhysicsCollider",
						"restitution":0,
						"friction":0.5,
						"rollingFriction":0,
						"shapes":[
							{
								"type":"BoxColliderShape",
								"center":[
									0,
									0,
									0
								],
								"size":[
									1,
									1,
									1
								]
							}
						],
						"isTrigger":false
					}
				],
				"child":[
					{
						"type":"MeshSprite3D",
						"instanceID":3,
						"props":{
							"name":"Cube",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0.001,
								9.95,
								-0.0665
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1.0113,
								1,
								-0.2389311
							],
							"meshPath":"Library/unity default resources-Cube.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/Material/Plane.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											0,
											0,
											0
										],
										"size":[
											1,
											1,
											1
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":4,
						"props":{
							"name":"Cube (1)",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.5515152,
								4.933333,
								-0.066
							],
							"rotation":[
								0,
								0,
								-0.7071068,
								-0.7071068
							],
							"scale":[
								11,
								0.09090913,
								-0.2389309
							],
							"meshPath":"Library/unity default resources-Cube.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/Material/Plane.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											0,
											0,
											0
										],
										"size":[
											1,
											1,
											1
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":5,
						"props":{
							"name":"Cube (2)",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0.543,
								4.933333,
								-0.066
							],
							"rotation":[
								0,
								0,
								-0.7071068,
								-0.7071068
							],
							"scale":[
								11,
								0.09090913,
								-0.2389309
							],
							"meshPath":"Library/unity default resources-Cube.lm",
							"enableRender":true,
							"materials":[
								{
									"path":"Assets/Material/Plane.lmat"
								}
							]
						},
						"components":[
							{
								"type":"PhysicsCollider",
								"restitution":0,
								"friction":0.5,
								"rollingFriction":0,
								"shapes":[
									{
										"type":"BoxColliderShape",
										"center":[
											0,
											0,
											0
										],
										"size":[
											1,
											1,
											1
										]
									}
								],
								"isTrigger":false
							}
						],
						"child":[]
					}
				]
			},
			{
				"type":"MeshSprite3D",
				"instanceID":6,
				"props":{
					"name":"Player",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						-0.04499996,
						0.206,
						-13.5618
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						0.371461,
						0.1102914,
						0.6465797
					],
					"meshPath":"Library/unity default resources-Cube.lm",
					"enableRender":true,
					"materials":[
						{
							"path":"Assets/Material/Car.lmat"
						}
					]
				},
				"components":[
					{
						"type":"Rigidbody3D",
						"mass":1,
						"isKinematic":false,
						"restitution":0,
						"friction":0.5,
						"rollingFriction":0,
						"linearDamping":0,
						"angularDamping":0,
						"overrideGravity":true,
						"gravity":[
							0,
							0,
							0
						],
						"shapes":[
							{
								"type":"BoxColliderShape",
								"center":[
									0,
									0,
									0
								],
								"size":[
									1,
									1,
									1
								]
							}
						],
						"isTrigger":true
					}
				],
				"child":[]
			},
			{
				"type":"ShuriKenParticle3D",
				"instanceID":7,
				"props":{
					"name":"speedParticle",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						1.13,
						-12.21
					],
					"rotation":[
						-1,
						0,
						0,
						0
					],
					"scale":[
						0.09860068,
						0.09860068,
						0.09860068
					],
					"isPerformanceMode":true,
					"duration":5,
					"looping":true,
					"prewarm":false,
					"startDelayType":0,
					"startDelay":0,
					"startDelayMin":0,
					"startDelayMax":0,
					"startLifetimeType":0,
					"startLifetimeConstant":3,
					"startLifetimeConstantMin":0,
					"startLifetimeConstantMax":3,
					"startLifetimeGradient":{
						"startLifetimes":[]
					},
					"startLifetimeGradientMin":{
						"startLifetimes":[]
					},
					"startLifetimeGradientMax":{
						"startLifetimes":[]
					},
					"startSpeedType":0,
					"startSpeedConstant":50,
					"startSpeedConstantMin":0,
					"startSpeedConstantMax":50,
					"threeDStartSize":false,
					"startSizeType":2,
					"startSizeConstant":0.3,
					"startSizeConstantMin":0.2,
					"startSizeConstantMax":0.3,
					"startSizeConstantSeparate":[
						0.3,
						1,
						1
					],
					"startSizeConstantMinSeparate":[
						0.2,
						1,
						1
					],
					"startSizeConstantMaxSeparate":[
						0.3,
						1,
						1
					],
					"threeDStartRotation":false,
					"startRotationType":0,
					"startRotationConstant":0,
					"startRotationConstantMin":0,
					"startRotationConstantMax":0,
					"startRotationConstantSeparate":[
						0,
						0,
						0
					],
					"startRotationConstantMinSeparate":[
						0,
						0,
						0
					],
					"startRotationConstantMaxSeparate":[
						0,
						0,
						0
					],
					"randomizeRotationDirection":0,
					"startColorType":0,
					"startColorConstant":[
						1,
						1,
						1,
						1
					],
					"startColorConstantMin":[
						0,
						0,
						0,
						0
					],
					"startColorConstantMax":[
						1,
						1,
						1,
						1
					],
					"gravity":[
						0,
						-9.81,
						0
					],
					"gravityModifier":0,
					"simulationSpace":1,
					"simulationSpeed":1,
					"scaleMode":1,
					"playOnAwake":true,
					"maxParticles":100,
					"autoRandomSeed":true,
					"randomSeed":9.738032E+08,
					"emission":{
						"enable":true,
						"emissionRate":20,
						"emissionRateTip":"Time",
						"bursts":[]
					},
					"shape":{
						"enable":true,
						"shapeType":2,
						"sphereRadius":10,
						"sphereEmitFromShell":false,
						"sphereRandomDirection":0,
						"hemiSphereRadius":10,
						"hemiSphereEmitFromShell":false,
						"hemiSphereRandomDirection":0,
						"coneAngle":45,
						"coneRadius":10,
						"coneLength":5,
						"coneEmitType":0,
						"coneRandomDirection":0,
						"boxX":1,
						"boxY":1,
						"boxZ":1,
						"boxRandomDirection":0,
						"circleRadius":10,
						"circleArc":360,
						"circleEmitFromEdge":false,
						"circleRandomDirection":0
					},
					"renderMode":1,
					"stretchedBillboardCameraSpeedScale":1,
					"stretchedBillboardSpeedScale":0.1,
					"stretchedBillboardLengthScale":1,
					"sortingFudge":0,
					"material":{
						"type":"Laya.ShurikenParticleMaterial",
						"path":"Assets/Car/speed.lmat"
					}
				},
				"components":[],
				"child":[]
			},
			{
				"type":"MeshSprite3D",
				"instanceID":8,
				"props":{
					"name":"Fnish",
					"active":false,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						0.13,
						-10.08
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						2.9402,
						0.14196,
						0.48944
					],
					"meshPath":"Library/unity default resources-Cube.lm",
					"enableRender":true,
					"materials":[
						{
							"type":"Laya.BlinnPhongMaterial",
							"path":"Assets/Material/Fnish.lmat"
						}
					]
				},
				"components":[
					{
						"type":"PhysicsCollider",
						"restitution":0,
						"friction":0.5,
						"rollingFriction":0,
						"shapes":[
							{
								"type":"BoxColliderShape",
								"center":[
									0,
									0,
									0
								],
								"size":[
									1,
									1,
									1
								]
							}
						],
						"isTrigger":false
					}
				],
				"child":[]
			}
		]
	}
}