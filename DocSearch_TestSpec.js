/*Launching ExPRS application is not possible to automate using protractor tool. 
So we skipped that part of test cases and we have covered as much as possible Test Cases through document search URL*/


describe("EDM Document Search Test Cases",function(){
  var gridTestUtils = require('./gridTestUtils.spec.js');
  var GridObjectTest = require('./GridObjectTestUtils.spec');
		
  var grid1 = new GridObjectTest('docList');
  var grid2 = new GridObjectTest('grid2');
  
  //Local test DocSerach URL
  var docSearchURL = "https://ciit-exprs-search-ui-test.pdc.np.paas.lmig.com/#/search?useProxy=N";
  //var docSearchURL = "http://localhost:8080/#/search?useProxy=N";
  
  //text boxes in DocSearch screen
  var documentTypeDropdown = element(by.css('[name="docType"]'));
  var documentTitleDropdown = element.all(by.css('.ng-binding')).first();
  var claimNumbertxtbox = element(by.css('#claimNo'));
  var internalControlNumbertxtbox = element(by.css('#icn'));
  var documentControlNumbertxtbox = element(by.css('#dcn'));
  var payeeNametxtbox = element(by.css('#payeeName'));
  var providerTaxIDtxtbox = element(by.css('#providerTIN'));
  var bankNumbertxtbox = element(by.css('#bankNo'));
  var checkNumbertxtbox = element(by.css('#checkNo'));
  var loadFromtxtbox = element(by.css('#loadFrom'));
  var loadTotxtbox = element(by.css('#loadTo'));
  var includeDuplicatescheckbox = element(by.model('vm.incDuplicates'));
  var includeAdjustmentscheckbox = element(by.model('vm.incAdjustments'));
  var loadIcon = element.all(by.css('.throbber-loader')).first();
  
  var documentTypeLabel = element(by.xpath("//label[text()='Document Type:']"));
  var documentTitleLabel = element(by.xpath("//label[text()='Document Title:']"));
  var actualMBDocumentTitleValues = element.all(by.xpath("//div[@class='acol']/label/span"));
  var notificationCount = element(by.css('#totalDocs'));
  var chckDocumentTitle = element.all(by.xpath("//div[@class='acol']/label/input"));
  var cancelGridFilter = element.all(by.xpath("//i[@aria-label='Remove Filter']"));
  var errorMessageLabel = element.all(by.css('.error-message-left'));
  var rightErrorMessageLabel = element.all(by.css('.error-message-right'));
  
  //button's in docsearch screen
  var clearButton = element(by.xpath("//button[text()='Clear']"));
  var searchButton = element(by.css('[type="submit"]'));
  var showMoreButton = element(by.css('#showAllBtn'));
  var viewMultipleButton = element(by.css('#viewMultiBtn'));
  var exportButton = element(by.css('#exportBtn'));
  var printButton = element(by.css('#printBtn'));
  var printListButton = element(by.css('#printListBtn'));
  var rows = element.all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
  
  var viewDocumentIcon = element.all(by.css("img[src='../../images/ex_img_doc_C_generic_16.gif']"));
  
  var headerCellLabel = element.all( by.css('.ui-grid-header-cell-label') );
  
  var documentTypeValues = ['','eop','medBills'];
  var eopDocumentTitleValues = [' All',' Claimant and Customer Copy',' Combined checks (First page)',' Combined checks (Subsequent pages)',' Denial EOP',' Michigan EOR',' Negative EOP',' Single Checks'];
  var medicalBillsDocumentTitleValues = [' All',' Appeal',' Original Bill Image'];
  
  //Claim Numbers
  var eopClaimNumbers = ['WC116-A04918', 'WC823-A00002', 'WC197-511017'];
  var medicalBillClaimNumbers = ['WC823-A29660'];
  
  //More than 500 documents for Medical Bills
  var medicalBills500Documents = ['WC823-A30085'];	
  var medicalBillsMoreThan500Documents = ['WC823-A30086'];
  var medicalBillsLessThan500Documents = ['WC823-A30087'];
    
  
  beforeAll(function(){
	browser.manage().deleteAllCookies();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    
	//should login to EID login manager
	browser.ignoreSynchronization = true;
	browser.get('https://test-cmloginmanager.lmig.com/SecureLibsWeb/eid/signon.jsp');
	 
	var username = $('[name="USER"]');
	var password = $('[name="PASSWORD"]');
	 
	username.sendKeys('n9998257');
	password.sendKeys('exprsaug');
	var login = $('input[type=submit]');
	login.click();
	browser.sleep(5000);
	browser.getAllWindowHandles().then(function(handles) {
	  browser.driver.switchTo().window(handles[1]).then(function() {
	  browser.driver.close();
	  browser.driver.switchTo().window(handles[0]);
	  });
	});
	
    browser.get(docSearchURL);
    browser.sleep(6000);
  });
  
  var datestringtoMillis = function (datestring) {
	  var split = datestring.split('/');
	  return new Date(split[2], split[0]-1, split[1]).getTime();
  };
  
  //Common function's for repeated functionalities
  var selectDocumentType = function(docType){
	documentTypeDropdown.click();
	element(by.cssContainingText('option', docType)).click();
	notificationCount.click();
  };
  
  var deSelectDocumentType = function(){
	documentTypeDropdown.click();
	element(by.cssContainingText('option', "")).click();
	notificationCount.click();  
  };
  
  var selectDocumentTitle = function(docTitle){
	documentTitleDropdown.click();
	browser.sleep(500);
	element(by.xpath("//span[contains(text(),'" + docTitle +  "')]")).click();
	browser.sleep(500);
	element(by.xpath("//span[contains(text(),'All')]")).click(); 
	notificationCount.click();
	var actualDocTitle = element(by.xpath("//div[contains(text(),'" + docTitle + "')]"));
	expect(actualDocTitle.getText()).toContain(docTitle);	
  };
  
  var typeClaimNumber = function(claimnumber){
	claimNumbertxtbox.click();
	claimNumbertxtbox.clear();
	claimNumbertxtbox.sendKeys(claimnumber);
	browser.sleep(1000);
	expect(claimNumbertxtbox.getAttribute('value')).toEqual(claimnumber);
	browser.sleep(1000);
	notificationCount.click();
  };
  
  var typeDocumentControlNumber = function(dcnNumber){
	documentControlNumbertxtbox.click();
	documentControlNumbertxtbox.sendKeys(dcnNumber);
	browser.sleep(1000);
	expect(documentControlNumbertxtbox.getAttribute('value')).toEqual(dcnNumber);
	notificationCount.click();
  };
  
  var typeInternalControlNumber = function(icnNumber){
	internalControlNumbertxtbox.click();
	internalControlNumbertxtbox.sendKeys(icnNumber);
	browser.sleep(1000);
	expect(internalControlNumbertxtbox.getAttribute('value')).toEqual(icnNumber);
	notificationCount.click();
  };
  
  var typePayeeName = function(payeeName){
	payeeNametxtbox.click();
	payeeNametxtbox.sendKeys(payeeName);
	browser.sleep(1000);
	expect(payeeNametxtbox.getAttribute('value')).toEqual(payeeName);
	notificationCount.click();
  };
  
  var typeProviderTaxID = function(providertaxID){
	providerTaxIDtxtbox.click();
	providerTaxIDtxtbox.sendKeys(providertaxID);
	browser.sleep(1000);
	notificationCount.click();
  };
  
  var typeBankNumber = function(banknumber){
	bankNumbertxtbox.click();
	bankNumbertxtbox.sendKeys(banknumber);
	browser.sleep(1000);
	expect(bankNumbertxtbox.getAttribute('value')).toEqual(banknumber);
	notificationCount.click();
  };
  
  var typeCheckNumber = function(checknumber){
    checkNumbertxtbox.click();
    checkNumbertxtbox.sendKeys(checknumber);
    browser.sleep(1000);
    expect(checkNumbertxtbox.getAttribute('value')).toEqual(checknumber);
    notificationCount.click();
  };  
  
  var clickSearchButton = function(){
	browser.sleep(1000);
	expect(searchButton.isEnabled()).toBe(true);
	if(searchButton.isEnabled())
	{
		searchButton.click();
	}
	else
	{
		console.log("Search button is disabled");
	}
  };

  it("TC001_Doc Search_Validate the ability to search the documents in document search screen for EOP Document type",function(){
	//Selecting document type as EOP and document title as Claimant and Customer Copy
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	notificationCount.click();
	browser.sleep(6000);
	typeClaimNumber(eopClaimNumbers[1]);  
	
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
		{
	    	console.log('Search button is disabled When Claim Number field is entered for EOP');
	    }
    else
	    {
	    	expect(visiblity).toBe(true);
	    	searchButton.click();
	        //Verifying single row displayed in the grid
	        browser.sleep(5000);
	        var rowsCount = 0;
	        gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	        	rowsCount = count;
	        }).then(function() {
	   		if(rowsCount > 0) {
	   			expect(rows.get(0).isDisplayed()).toBe(true);
	   		} 
	        });
	    }
	}); 	  
  });
  
  it("TC002_Doc Search_Validate the ability to search the documents in document search screen for 'Medical' Document type",function(){
	//Selecting document type as Medical Bills and Document title as Appeal
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	selectDocumentTitle('Appeal');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	
	if(searchButton.isEnabled())
    {
      searchButton.click();
      browser.sleep(5000);
      var rows = element.all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
      expect(rows.get(0).isDisplayed()).toBe(true);
      browser.sleep(4000);
      
      //Validating documents are displayed based on the search criteria
      var rowsCount = 0;
 	  gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
 		rowsCount = count;
 	  }).then(function() {
 		for( var i = 0; i < rowsCount; i++) {
 			gridTestUtils.expectCellValueMatch('docList', i, 1, medicalBillClaimNumbers[0]); 
 			gridTestUtils.expectCellValueMatch('docList', i, 3, 'Appeal');
 		} 
 	  });       
    }
    else
    {
    	console.log("Search button is disabled");
    } 	  
  });
  
  it("TC003_Doc Search_Validate the ability to view the documents results in document search screen for EOP Document type",function(){
	browser.ignoreSynchronization = true;
	//Selecting document type as EOP and document title as Claimant and Customer Copy
	clearButton.click();
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	selectDocumentTitle('Single Checks');
	bankNumbertxtbox.click();	   
	typeClaimNumber(eopClaimNumbers[1]);
	
	clickSearchButton();
	browser.sleep(5000);	
	
	headerCellLabel.get(8).click();
	headerCellLabel.get(8).click();
	var rowsCount = 0;
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		rowsCount = count;
	}).then(function() {
	if(rowsCount > 0) {
		//should be able to view document for Claimant and Customer Copy document title 
	 	viewDocumentIcon.get(0).click();
	 	browser.sleep(3000);
	 	browser.getAllWindowHandles().then(function(handles){
	 		browser.switchTo().window(handles[1]).then(function(){
	 			var URL = browser.getCurrentUrl();
	 			expect(URL).toContain("https://test-exprsedm.lmig.com/rest/document/content/");		        
	 		});
	 		browser.driver.close();
	 		browser.driver.switchTo().window(handles[0]);
	 	});
	 } 
	});  
  });

  it("TC004_Doc Search_Validate the ability to view the documents results in document search screen for Medical Document type", function(){
	browser.ignoreSynchronization = true;
	//Selecting document type as Medical Bills and Document title as Appeal
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	selectDocumentTitle('Original Bill Image');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(4000);
	
	//should be able to view document for appeal document title 
	viewDocumentIcon.get(0).click();
	browser.sleep(2000);
	browser.getAllWindowHandles().then(function(handles){
	  browser.switchTo().window(handles[1]).then(function(){
	      var URL = browser.getCurrentUrl();
	      expect(URL).toContain("https://test-exprsedm.lmig.com/rest/document/content");		        
	  });
	  browser.driver.close();
	  browser.driver.switchTo().window(handles[0]);
	});	
  });
  
  it("TC005_Doc Search_Validate the ability to  export the document from document search result for EOP Document type",function(){
	//Selecting document type as EOP and document title as Claimant and Customer Copy
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	selectDocumentTitle('Denial EOP');
	bankNumbertxtbox.click();
	expect(documentTitleDropdown.getText()).toEqual(eopDocumentTitleValues[4]);
	   
	typeClaimNumber(eopClaimNumbers[1]);
	
	clickSearchButton();
	browser.sleep(3000);
	
	var rowsCount = 0;
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		rowsCount = count;
	}).then(function() {
	if(rowsCount > 0) {
		//Validating export button pop up window and clicking on No button
	 	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 1, 2)).click().perform();
	 	exportButton.click();
	 	browser.sleep(3000);
	 	var actualExportAlert = element(by.css('#ngdialog1-aria-describedby'));
	 	var expectedExportAlert = "Are you sure you want to export 1 documents?";
	 	expect(actualExportAlert.getText()).toEqual(expectedExportAlert);
	 	var exportYesButton = element(by.css('#yesBtn'));
	 	var exportNoButton = element(by.css('#noBtn'));
	 	expect(exportYesButton.isDisplayed()).toBe(true);
	 	expect(exportNoButton.isDisplayed()).toBe(true);	
	 	exportNoButton.click();
	 	expect(rows.get(0).isDisplayed()).toBe(true);
	 	
	 	//Validating export button pop up window and clicking on Yes button
	 	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 2)).click().perform();
	 	exportButton.click();
	 	browser.sleep(3000);
	 	exportYesButton.click();
	 	browser.sleep(4000);	
	 }
	 });
  });
  
  it("TC006_Doc Search_Validate the ability to  export the document from document search result for Medical Document type",function(){
	//Selecting document type as Medical Bills and Document title as Appeal
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	selectDocumentTitle('Original Bill Image');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(4000);	
	
	//Validating export button pop up window and clicking on No button
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 1, 2)).click().perform();
	exportButton.click();
	browser.sleep(3000);
	var exportNoButton = element(by.css('#noBtn'));
	var exportYesButton = element(by.css('#yesBtn'));
	exportNoButton.click();
	expect(rows.get(0).isDisplayed()).toBe(true);
	
	//Validating export button pop up window and clicking on Yes button
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 2)).click().perform();
	exportButton.click();
	browser.sleep(3000);
	exportYesButton.click();
	browser.sleep(4000);
	
	//We can not automate to open, save and save as options for exported document	
  });
	
  it("TC010_Doc Serach_Validate the ability to print the document from document search result for Medical Document type", function(){
	//Selecting document type as Medical Bills and Document title as Appeal
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	selectDocumentTitle('Original Bill Image');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(4000);
	
	//Validating documents are displayed based on the search criteria
    var rowsCount = 0;
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	rowsCount = count;
	}).then(function() {
		for( var i = 0; i < rowsCount; i++) {
			gridTestUtils.expectCellValueMatch('docList', i, 1, medicalBillClaimNumbers[0]); 
			gridTestUtils.expectCellValueMatch('docList', i, 3, 'Original Bill Image');
		} 
	});  
	  
	//printing the selected document
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 1, 2)).click().perform();
	printButton.click();
	browser.sleep(4000);
	
	var actualPrintAlert = element(by.xpath("//p[contains(text(),'Sending 1 document to be printed.')]"));
	var expectedPrintAlert = "Sending 1 document to be printed.";
	expect(actualPrintAlert.getText()).toEqual(expectedPrintAlert);
	var printOkButton = element(by.id('okBtn'));
	var printCancelButton = element(by.id('cancelBtn'));
	printCancelButton.click();
	browser.sleep(5000);
	
	//TO-DO need to handle print dialogue window
	/*printOkButton.click();
	browser.sleep(5000);
	
	browser.getAllWindowHandles().then(function(handles) {
	  browser.driver.switchTo().window(handles[1]).then(function() {
		  browser.driver.wait(function() {
			  browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			  browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
			  browser.sleep(4000);
			  return browser.driver.getCurrentUrl().then(function(url) {
		      expect(url).toContain('https://test-exprsedm.lmig.com/rest/document/');
		      return url;
		      });
	      });
	      browser.driver.close();	
	      browser.driver.switchTo().window(handles[0]);
	  });	
	});*/
	
	expect(rows.get(0).isDisplayed()).toBe(true);	
  });
  
  it("TC018_Doc Search_Validate the 'Document Type' field in search area", function(){
	documentTypeDropdown.click();
	var expectedDocTypeDropDownValues = ['','EOP','Medical Bills'];
	var actualDocTypeDropDownValues = element.all(by.xpath("//select[@name='docType']/option"));
	
	for(var i = 0; i < expectedDocTypeDropDownValues.length; ++i)
	{
		browser.sleep(500);
		expect(actualDocTypeDropDownValues.get(i).getText()).toEqual(expectedDocTypeDropDownValues[i]);
	}
	notificationCount.click();
	
	expect(documentTypeLabel.getCssValue('font')).toEqual('normal normal bold normal 14px / 20px "Helvetica Neue", Helvetica, Arial, sans-serif');
	
	//Validating EOP document title drop down values
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	documentTitleDropdown.click();	
	
	var actualEOPDocumentTitleValues = element.all(by.xpath("//div[@class='acol']/label/span"));
	var expectedEOPDocumentTitleValues = [' All',' Claimant and Customer Copy',' Combined checks (First page)',' Combined checks (Subsequent pages)',' Denial EOP',' Michigan EOR',' Negative EOP',' Single Checks'];
	for(var j = 0; j < expectedEOPDocumentTitleValues.length; ++j)
	{
		browser.sleep(500);
		expect(actualEOPDocumentTitleValues.get(j).getText()).toEqual(expectedEOPDocumentTitleValues[j]);
	}
	
	//Validating Medical Bills document title drop down values
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	documentTitleDropdown.click();

	var expectedMBDocumentTitleValues = [' All',' Appeal',' Original Bill Image'];
	for(var k = 0; k < expectedMBDocumentTitleValues; ++k)
	{
		browser.sleep(500);
		expect(actualMBDocumentTitleValues.get(k).getText()).toEqual(expectedMBDocumentTitleValues[k]);
	}
	
	expect(documentTitleLabel.getCssValue('font')).toEqual('normal normal bold normal 14px / 20px "Helvetica Neue", Helvetica, Arial, sans-serif');
	
	//Verifying search result gets removed when selecting document type
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(3000);
	expect(rows.get(0).isDisplayed()).toBe(true);
	
	selectDocumentType('EOP');
	internalControlNumbertxtbox.click();
	browser.sleep(3000);
	expect(claimNumbertxtbox.getAttribute('placeholder')).toEqual('WC___-______');
	expect(notificationCount.getText()).toContain('Your search returned');	
  });
  
  it("TC020_Doc Search_Validate the 'Document Title' field in search area for medical bills as DOC type", function(){
	documentTypeDropdown.click();
	var expectedDocTypeDropDownValues = ['','EOP','Medical Bills'];
	var actualDocTypeDropDownValues = element.all(by.xpath("//select[@name='docType']/option"));
		
	for(var i = 0; i < expectedDocTypeDropDownValues.length; ++i)
	{
		browser.sleep(500);
		expect(actualDocTypeDropDownValues.get(i).getText()).toEqual(expectedDocTypeDropDownValues[i]);
	}
	element(by.cssContainingText('option','Medical Bills')).click();
	
	//validating document title for Medical Bills document type
	documentTitleDropdown.click();
	browser.sleep(2000);
	var actualMBDocumentTitleValues = element.all(by.xpath("//div[@class='acol']/label/span"));
	var expectedMBDocumentTitleValues = [' All',' Appeal',' Original Bill Image'];
	for(var k = 0; k < expectedMBDocumentTitleValues; ++k)
	{
		browser.sleep(500);
		expect(actualMBDocumentTitleValues.get(k).getText()).toEqual(expectedMBDocumentTitleValues[k]);
	}
	expect(documentTypeLabel.getCssValue('font')).toEqual('normal normal bold normal 14px / 20px "Helvetica Neue", Helvetica, Arial, sans-serif');
	expect(actualMBDocumentTitleValues.get(0).getText()).toBe(" All");
	
	//validating select and de-select option for document title
	notificationCount.click();
	documentTitleDropdown.click();
	browser.sleep(1000);
	element(by.xpath("//span[contains(text(),'Appeal')]")).click();
	element(by.xpath("//span[contains(text(),'All')]")).click();
	element(by.xpath("//span[contains(text(),'Original Bill Image')]")).click();
	element(by.xpath("//span[contains(text(),'Appeal')]")).click();
	element(by.xpath("//span[contains(text(),'All')]")).click();
	element(by.xpath("//span[contains(text(),'Original Bill Image')]")).click();
	element(by.xpath("//span[contains(text(),'Appeal')]")).click();
	browser.get(docSearchURL);
	browser.sleep(3000);
	selectDocumentType('Medical Bills');
	notificationCount.click();
	
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(4000);
	documentTitleDropdown.click();
	expect(chckDocumentTitle.get(0).getAttribute('checked')).toBe('true');
	browser.sleep(1500);
	notificationCount.click();	
  });
  
  it("TC021_Doc Search_Validate the 'Document Title' field in search area for EOP as DOC type", function(){
	documentTypeDropdown.click();
	var expectedDocTypeDropDownValues = ['','EOP','Medical Bills'];
	var actualDocTypeDropDownValues = element.all(by.xpath("//select[@name='docType']/option"));
			
	for(var i = 0; i < expectedDocTypeDropDownValues.length; ++i)
	{
		browser.sleep(500);
		expect(actualDocTypeDropDownValues.get(i).getText()).toEqual(expectedDocTypeDropDownValues[i]);
	}
	element(by.cssContainingText('option','EOP')).click();
	
	//validating document title for Medical Bills document type
	documentTitleDropdown.click();
	browser.sleep(2000);
	var actualEOPDocumentTitleValues = element.all(by.xpath("//div[@class='acol']/label/span"));
	var expectedEOPocumentTitleValues = [' All',' Claimant and Customer Copy',' Combined checks (First page)',' Combined checks (Subsequent pages)',' Denial EOP',' Michigan EOR',' Negative EOP',' Single Checks'];
	for(var k = 0; k < expectedEOPocumentTitleValues; ++k)
	{
		browser.sleep(500);
		expect(actualEOPDocumentTitleValues.get(k).getText()).toEqual(expectedEOPocumentTitleValues[k]);
	}
	expect(documentTypeLabel.getCssValue('font')).toEqual('normal normal bold normal 14px / 20px "Helvetica Neue", Helvetica, Arial, sans-serif');
	expect(actualEOPDocumentTitleValues.get(0).getText()).toBe(" All");
	
	//validating select and de-select option for document title
	notificationCount.click();
	documentTitleDropdown.click();
	browser.sleep(1000);
	element(by.xpath("//span[contains(text(),'Claimant and Customer Copy')]")).click();
	element(by.xpath("//span[contains(text(),'Michigan EOR')]")).click();
	element(by.xpath("//span[contains(text(),'Combined checks (First page)')]")).click();
	element(by.xpath("//span[contains(text(),'Denial EOP')]")).click();
	element(by.xpath("//span[contains(text(),'Negative EOP')]")).click();
	element(by.xpath("//span[contains(text(),'All')]")).click();
	element(by.xpath("//span[contains(text(),'Combined checks (Subsequent pages)')]")).click();
	element(by.xpath("//span[contains(text(),'Single Checks')]")).click();
	element(by.xpath("//span[contains(text(),'Combined checks (First page)')]")).click();
	element(by.xpath("//span[contains(text(),'Michigan EOR')]")).click();
	element(by.xpath("//span[contains(text(),'Claimant and Customer Copy')]")).click();
	element(by.xpath("//span[contains(text(),'Single Checks')]")).click();
	element(by.xpath("//span[contains(text(),'Denial EOP')]")).click();
	element(by.xpath("//span[contains(text(),'Negative EOP')]")).click();
	element(by.xpath("//span[contains(text(),'Combined checks (Subsequent pages)')]")).click();
	element(by.xpath("//span[contains(text(),'All')]")).click();
	notificationCount.click();	
  });
  
  it("TC023_Doc Search_Validate the 'Claim Number' field is enabled", function(){
	//Validating visibility of Claim number text box 
	browser.get(docSearchURL);
	browser.sleep(4000);
	expect(claimNumbertxtbox.getAttribute('disabled')).toBe('true');
	selectDocumentType('Medical Bills');
	selectDocumentTitle('Appeal');
	expect(claimNumbertxtbox.getAttribute('disabled')).toBeNull();
	
	//As per veera comment i have added script to validate alert message while searching document by selecting document title as All
	documentTitleDropdown.click();
	browser.sleep(500);
	element(by.xpath("//span[contains(text(),'Appeal')]")).click(); 
	notificationCount.click();
	
	typeClaimNumber(medicalBillClaimNumbers[0]);	
	clickSearchButton();
	browser.sleep(1000);
	var errorLabel = element(by.css('.error-message-left'));
	expect(errorLabel.isDisplayed()).toBe(true);
	var actualAlert = "Doc title selection is required";
	expect(errorLabel.getText()).toEqual(actualAlert);	
  });
  
  it("TC024_Doc Search_Validate the 'Claim Number' field is disabled", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	browser.sleep(1000);
	selectDocumentTitle('Appeal');
	browser.sleep(2000);
	expect(claimNumbertxtbox.getAttribute('disabled')).toBeNull();	
  });
  
  it("TC026_Doc Search_Validate the 'Document Control Number (DCN)'  field is enabled", function(){
	clearButton.click();
	browser.sleep(1000);
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	browser.sleep(1000);
	selectDocumentTitle('Appeal');
	expect(documentControlNumbertxtbox.getAttribute('disabled')).toBeNull();
	notificationCount.click();
	selectDocumentTitle('Original Bill Image');
	expect(documentControlNumbertxtbox.getAttribute('disabled')).toBeNull();
  });
  
  it("TC028_Doc Search_Validate the 'Document Control Number (DCN)'  field is hidden", function(){
	clearButton.click();
	browser.sleep(2000);
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	expect(documentControlNumbertxtbox.isDisplayed()).toBe(false);
  });
  
  it("TC029_Doc Search_Validate the 'Document Control Number (DCN)' field attributes in search area", function(){
	clearButton.click();
	browser.sleep(2000);
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	expect(documentControlNumbertxtbox.isEnabled()).toBe(true);
	//removing DCN Number by giving BACKSPACE
	documentControlNumbertxtbox.sendKeys(medicalBillClaimNumbers[0]).then(function() {
		documentControlNumbertxtbox.sendKeys(protractor.Key.BACK_SPACE).then(function() {
			browser.sleep(2000);
            expect(documentControlNumbertxtbox.getAttribute('value')).toEqual('WC823-A2966');
        });
    });
	
	documentControlNumbertxtbox.clear();
	documentControlNumbertxtbox.sendKeys(medicalBillClaimNumbers[0]);
	documentControlNumbertxtbox.sendKeys(protractor.Key.CONTROL, "a");
	documentControlNumbertxtbox.sendKeys(protractor.Key.CONTROL, "x");
	expect(documentControlNumbertxtbox.getAttribute('value')).toEqual('');
	claimNumbertxtbox.click();
	claimNumbertxtbox.sendKeys(protractor.Key.CONTROL, "v");
	browser.actions().sendKeys(protractor.Key.NULL).perform();
	browser.sleep(2000);
	expect(claimNumbertxtbox.getAttribute('value')).toEqual(medicalBillClaimNumbers[0]);	
  });
  
  it("TC030_Doc Search_Validate the alert #5378", function(){
	clearButton.click();
	browser.sleep(2000);
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	expect(documentControlNumbertxtbox.isEnabled()).toBe(true);
	
	//Expected behavior for DCN field is different, as of now we are facing issue in this functionality. Once the code has been fixed we need to rework on this
	documentControlNumbertxtbox.sendKeys("86328");
	expect(documentControlNumbertxtbox.getAttribute('value')).toEqual("86328");
	clickSearchButton();
	browser.sleep(3000);
	expect(errorMessageLabel.get(2).isDisplayed()).toBe(true);
	var expectedDCNAlertmessage = "Document Control Number (DCN) must be 15 characters in length.";
	expect(errorMessageLabel.get(2).getText()).toEqual(expectedDCNAlertmessage);
	
	//Validating Document Control Number field length
	expect(documentControlNumbertxtbox.getAttribute('limit-to')).toEqual("15");
  });
  
  it("TC031_Doc Search_Validate the 'Internal Control Number (ICN)'  field is enabled", function(){
	clearButton.click();
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	browser.sleep(2000);
	selectDocumentTitle('Claimant and Customer Copy');
	//Verifying ICN field is enabled
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);	
	
	//As per veera's reviewed comment i have updated script to validate ICN field is enabled for all the EOP document title
	selectDocumentTitle('Combined checks (First page)');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
	
	selectDocumentTitle('Combined checks (Subsequent pages)');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
		
	selectDocumentTitle('Denial EOP');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
	
	selectDocumentTitle('Michigan EOR');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
		
	selectDocumentTitle('Negative EOP');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
		
	selectDocumentTitle('Single Checks');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
  });
  
  it("TC033_Doc Search_Validate the 'Internal Control Number (ICN)'  field is hidden", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	browser.sleep(2000);
	selectDocumentTitle('Appeal');
	expect(internalControlNumbertxtbox.isDisplayed()).toBe(false);
  });
  
  it("TC035_Doc Search_Validate the alert #5377", function(){
	clearButton.click();
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	browser.sleep(2000);
	selectDocumentTitle('Denial EOP');
    expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
    internalControlNumbertxtbox.sendKeys("8734");
    clickSearchButton();
    browser.sleep(2000);
    expect(errorMessageLabel.get(4).isDisplayed()).toBe(true);
    var expectedICNalertmessage = "Internal Control Number (ICN) must be 10 characters in length.";
    expect(errorMessageLabel.get(4).getText()).toEqual(expectedICNalertmessage);    
  });
  
  it("TC040_Doc Search_Validate the alert#104", function() {
	clearButton.click();
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	selectDocumentTitle('Claimant and Customer Copy');
	//Validate the Payee Name field is enabled
	expect(payeeNametxtbox.getAttribute('disabled')).toBeNull();
	//Validate the alert#104 will be displayed
	payeeNametxtbox.sendKeys('a');
	clickSearchButton();
	browser.sleep(4000);
	expect(errorMessageLabel.get(5).isDisplayed()).toBe(true);
	var expectedalert = "Payee Name requires at least 2 characters, or 3 characters if a wildcard (*) is entered";
	expect(errorMessageLabel.get(5).getText()).toEqual(expectedalert);
	//Validate the minimum of 2 characters are required for the search
	payeeNametxtbox.clear();
	payeeNametxtbox.sendKeys('al');
	expect(searchButton.isEnabled()).toBe(true);
	    
	payeeNametxtbox.clear();
	payeeNametxtbox.sendKeys("pay");
	expect(searchButton.isEnabled()).toBe(true);
  });
  
  it("TC055_Doc Search_Validate the 'Filtering event' in search result", function(){
	//Applying filter in grid column for Medical Bills document type
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
		
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	
	//Applying filter in Claim Number column
	gridTestUtils.enterFilterInColumn('docList', 1, 'WC823-A29660');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 1, 'WC823-A29660');  
	  } 
	});	
	expect(cancelGridFilter.get(0).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(0)).click().perform();
	
	//Applying filter in Load Date column
	gridTestUtils.enterFilterInColumn('docList', 2, '03/03/2017');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 2, '03/03/2017');  
	  } 
	});	
	expect(cancelGridFilter.get(1).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(1)).click().perform();
	
	//applying filter in Doc Title column
	var rowsCount = 0;
	gridTestUtils.enterFilterInColumn('docList', 3, 'Original Bill Image');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Original Bill Image');  
	  } 
	});
	notificationCount.click();
	
	//removing filter from Doc Title column
	expect(cancelGridFilter.get(2).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(2)).click().perform();
	
	//Applying filter in DCN column
	gridTestUtils.enterFilterInColumn('docList', 4, 'Klhv9l9F1nV05v');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 4, 'Klhv9l9F1nV05v');  
	  } 
	});	
	expect(cancelGridFilter.get(3).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(3)).click().perform();
		
	//Applying filter in grid column for EOP document type
	clearButton.click();
	selectDocumentType('EOP');
	typeClaimNumber(eopClaimNumbers[1]);
	notificationCount.click();
	
	clickSearchButton();
	browser.sleep(10000);
	
	//Applying filter in Claim Number column
	gridTestUtils.enterFilterInColumn('docList', 1, 'WC823-A00002');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	 rowsCount = count;
	 expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 1, 'WC823-A00002');  
	  } 
	});
	expect(cancelGridFilter.get(0).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(0)).click().perform();
	
	//Applying filter in Load date column
	gridTestUtils.enterFilterInColumn('docList', 2, '04/28/2017');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 2, '04/28/2017');  
	  } 
	});
	expect(cancelGridFilter.get(1).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(1)).click().perform();
	
	//Applying filter in Doc Title column
	gridTestUtils.enterFilterInColumn('docList', 3, 'Denial EOP');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Denial EOP');  
	  } 
	});	
	expect(cancelGridFilter.get(2).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(2)).click().perform();
	
	//Applying filter in ICN column
	gridTestUtils.enterFilterInColumn('docList', 4, '568229686464');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 4, '568229686464');  
	  } 
	});	
	expect(cancelGridFilter.get(3).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(3)).click().perform();
	
	//Applying filter in Sequence column
	gridTestUtils.enterFilterInColumn('docList', 5, '1');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 5, '1');  
	  } 
	});	
	expect(cancelGridFilter.get(4).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(4)).click().perform();
	
	//Applying filter in Provider Tax ID column
	gridTestUtils.enterFilterInColumn('docList', 6, '1889');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 6, '1889');  
	  } 
	});	
	expect(cancelGridFilter.get(5).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(5)).click().perform();
	
	//Applying filter in Payee Name column
	gridTestUtils.enterFilterInColumn('docList', 7, 'PAYEE NAME');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 7, 'PAYEE NAME');
	  } 
	});	
	expect(cancelGridFilter.get(6).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(6)).click().perform();
	
	//Applying filter in Bank Number column
	gridTestUtils.enterFilterInColumn('docList', 8, '288');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 8, '288');  
	  } 
	});	
	expect(cancelGridFilter.get(7).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(7)).click().perform();
	
	//Applying filter in Check Number column
	gridTestUtils.enterFilterInColumn('docList', 9, '2998385');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 9, '2998385');  
	  } 
	});	
	expect(cancelGridFilter.get(8).isDisplayed()).toBe(true);
	browser.actions().mouseMove(cancelGridFilter.get(8)).click().perform();	
  });
  
  it("TC056_Doc Search_Validate the 'column headings' in search result", function(){
	//Validating column header tool tip for Medical Bills document type 
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	
	for(var i = 2; i < 5; ++i)
	{
		browser.actions().mouseMove(element(by.xpath("(//div[@col-index='renderIndex'])[" + i + "]"))).mouseMove({ x : 50, y : 0 }).perform();
		browser.sleep(2000);
		var expectedMBheadertooltip = element(by.xpath("(//div[@col-index='renderIndex'])[" + i + "]/span[1]"));
		expect(element(by.xpath("(//div[@col-index='renderIndex'])[" + i + "]")).getAttribute('title')).toEqual(expectedMBheadertooltip.getText());		
	}
	//Validating column header tool tip for EOP document type
	clearButton.click();
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	
	for(var i = 2; i < 11; ++i)
	{
		browser.actions().mouseMove(element(by.xpath("(//div[@col-index='renderIndex'])[" + i + "]"))).mouseMove({ x : 50, y : 0 }).perform();
		browser.sleep(2000);
		var expectedEOPheadertooltip = element(by.xpath("(//div[@col-index='renderIndex'])[" + i + "]/span[1]"));
		expect(element(by.xpath("(//div[@col-index='renderIndex'])[" + i + "]")).getAttribute('title')).toContain(expectedEOPheadertooltip.getText());		
	}	
  });
  
  it("TC068_Doc Search_Validate the 'Clear' button functions", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	expect(clearButton.isEnabled()).toBe(true);
	typeClaimNumber(medicalBillClaimNumbers[0]);
	documentControlNumbertxtbox.sendKeys("786347");
	expect(documentControlNumbertxtbox.getAttribute('value')).toEqual("786347");
	clearButton.click();
	
	expect(claimNumbertxtbox.getAttribute('value')).toBe("");
	expect(documentControlNumbertxtbox.getAttribute('value')).toBe("");
	
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	expect(clearButton.isEnabled()).toBe(true);
	typeClaimNumber(eopClaimNumbers[1]);
	expect(claimNumbertxtbox.getAttribute('value')).toEqual(eopClaimNumbers[1]);	
  });
  
  it("TC049_Doc Search_Validate the ability to perform Medical Bills search with Claim Number", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	selectDocumentTitle('Original Bill Image');
	
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(3000);
	expect(claimNumbertxtbox.getAttribute('value')).toEqual(medicalBillClaimNumbers[0]);
	expect(rows.get(0).isDisplayed()).toBe(true);	 
  });
  
  it("TC050_Doc Search_Validate the ability to perform Medical Bills search with Document Control Number", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	selectDocumentTitle('Appeal');
	typeDocumentControlNumber('Klhv9l9F1mV05v');
	clickSearchButton();
	
	browser.sleep(5000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 4, 'Klhv9l9F1mV05v');  
	  } 
	});		
  });
 
  it("TC006_Doc Search GUI_Validate the alert 101", function(){
	clearButton.click();
	selectDocumentType('EOP');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	browser.sleep(2000);
	clickSearchButton();	
	
	//Validating load date from and through placeholder
	expect(loadFromtxtbox.getAttribute('placeholder')).toEqual('mm/dd/yyyy');
	expect(loadTotxtbox.getAttribute('placeholder')).toEqual('mm/dd/yyyy');
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	}
	today = mm+'/'+dd+'/'+yyyy;
	
	loadFromtxtbox.sendKeys(today);
	var actualfromDate = loadFromtxtbox.getAttribute('value');
	expect(actualfromDate).toEqual(today);
	
	if(dd<=9) {
	    dd= dd
	} 
	else{
	 dd = 2 + dd
	}
	var AfterTwoDays = mm+'/'+dd+'/'+yyyy;
	
	loadTotxtbox.sendKeys(AfterTwoDays);
	var actualthroughDate = loadTotxtbox.getAttribute('value');
	expect(actualthroughDate).toEqual(AfterTwoDays);
	notificationCount.click();
	
	if(actualfromDate > actualthroughDate)
	{
		console.log ('Load from date is greater than load through date');
	}
	
	loadFromtxtbox.click();
	loadFromtxtbox.clear();
	clickSearchButton();
	browser.sleep(2000);
	expect(rightErrorMessageLabel.get(3).getText()).toEqual('If one Date of Service is entered, they both must be entered');
  });
  
  it("TC006_Doc Search GUI_Validate the alert 102", function(){
	clearButton.click();
	selectDocumentType('EOP');
	typeClaimNumber(eopClaimNumbers[1]);
	browser.sleep(2000);
	
	//Validating load date from and through placeholder
	expect(loadFromtxtbox.getAttribute('placeholder')).toEqual('mm/dd/yyyy');
	expect(loadTotxtbox.getAttribute('placeholder')).toEqual('mm/dd/yyyy');
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	
	if(dd<10) {
	   dd='0'+dd
	} 
	if(mm<10) {
	   mm='0'+mm
	}
	today = mm+'/'+dd+'/'+yyyy;
	
	loadFromtxtbox.sendKeys(today);
	var actualfromDate = loadFromtxtbox.getAttribute('value');
	expect(actualfromDate).toEqual(today);
	
	
	if(dd<=9) {
	    dd= dd
	} 
	else{
	 dd = 2 + dd
	}
	var AfterTwoDays = mm+'/'+dd+'/'+yyyy;
	
	loadTotxtbox.sendKeys(AfterTwoDays);
	var actualthroughDate = loadTotxtbox.getAttribute('value');
	expect(actualthroughDate).toEqual(AfterTwoDays);
	notificationCount.click();
	
	if(actualfromDate > actualthroughDate)
	{
		console.log ('Load from date is greater than load through date');
	}
	  
	loadTotxtbox.click();
	loadTotxtbox.clear();
	loadFromtxtbox.clear();
	loadFromtxtbox.sendKeys(today);
	notificationCount.click();
	clickSearchButton();
	browser.sleep(2000);
	expect(rightErrorMessageLabel.get(3).getText()).toEqual('If one Date of Service is entered, they both must be entered');
  });
  
  it("TC044_Doc Search_Validate the document titles of 'Medical Bills' document type", function(){	
	//Validating Medical Bills document title drop down values
	selectDocumentType('Medical Bills');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
	documentTitleDropdown.click();

	var expectedMBDocumentTitleValues = [' All',' Appeal',' Original Bill Image'];
	for(var k = 0; k < expectedMBDocumentTitleValues; ++k)
	{
		browser.sleep(500);
		expect(actualMBDocumentTitleValues.get(k).getText()).toEqual(expectedMBDocumentTitleValues[k]);
	}	
  });
  
  it("TC045_Doc Search_Validate the document titles of 'EOP' document type", function(){
	clearButton.click();
	//Validating EOP document title drop down values
	selectDocumentType('EOP');
	expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[1]);
	documentTitleDropdown.click();	
	
	var actualEOPDocumentTitleValues = element.all(by.xpath("//div[@class='acol']/label/span"));
	var expectedEOPDocumentTitleValues = [' All',' Claimant and Customer Copy',' Combined checks (First page)',' Combined checks (Subsequent pages)',' Denial EOP',' Michigan EOR',' Negative EOP',' Single Checks'];
	for(var j = 0; j < expectedEOPDocumentTitleValues.length; ++j)
	{
		browser.sleep(500);
		expect(actualEOPDocumentTitleValues.get(j).getText()).toEqual(expectedEOPDocumentTitleValues[j]);
	}
  });
  
  it("TC046_Doc Search_Validate the default document title selection in Document search screen", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	
	//Validating default selection for document title
	var actualDocTitle = element(by.xpath("//div[contains(text(),'All')]"));
	expect(actualDocTitle.getText()).toContain('All');	
	
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	
	//Validating search result based on the selected document title
	gridTestUtils.enterFilterInColumn('docList', 3, 'Appeal');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Appeal');  
	  } 
	});
	
	//Validating default selection for document title
	clearButton.click();
	selectDocumentType('Medical Bills');
	var actualDocTitle = element(by.xpath("//div[contains(text(),'All')]"));
	expect(actualDocTitle.getText()).toContain('All');	
	
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	
	gridTestUtils.enterFilterInColumn('docList', 3, 'Original Bill Image');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Original Bill Image');  
	  } 
	});	
  });
  
  it("TC047_Doc Search_Validate the multiple titles to be selected by the end user", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	documentTitleDropdown.click();
	element(by.xpath("//span[contains(text(),'Original Bill Image')]")).click();
	element(by.xpath("//span[contains(text(),'All')]")).click(); 
	element(by.xpath("//span[contains(text(),'All')]")).click();
	notificationCount.click();
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(4000);
	notificationCount.click();
	
	//Validating search result based on the selected document title
	gridTestUtils.enterFilterInColumn('docList', 3, 'Appeal');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Appeal');  
	  } 
	});
	clearButton.click();
	selectDocumentType('Medical Bills');
	documentTitleDropdown.click();
	element(by.xpath("//span[contains(text(),'Original Bill Image')]")).click();
	element(by.xpath("//span[contains(text(),'All')]")).click(); 
	element(by.xpath("//span[contains(text(),'All')]")).click();
	notificationCount.click();
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(4000);
	notificationCount.click();
	
	gridTestUtils.enterFilterInColumn('docList', 3, 'Original Bill Image');
	browser.sleep(4000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
	  rowsCount = count;
	  expect(rowsCount).toBeGreaterThan(0);
	}).then(function() {
	  for( var i = 0; i < rowsCount; i++) {
		  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Original Bill Image');  
	  } 
	});	
  });
  
  it("TC048_Doc Search_Validate the Mandatory field selection for Medical Bills search", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	selectDocumentTitle('Appeal');
	
	//Validate Claim Number field as mandatory field
	typeClaimNumber(medicalBillClaimNumbers[0]);
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Claim Number field is entered for Medical Bills');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});	
	claimNumbertxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate DCN field as mandatory field
	typeDocumentControlNumber('Klhv9l9F1mV05v');
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When DCN field is entered for Medical Bills');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});	
  });

  it("TC051_Doc Search_Validate the Mandatory field selection for EOP type search", function(){
	clearButton.click();
	selectDocumentType('EOP');
	selectDocumentTitle('Combined checks (Subsequent pages)');
	
	//Validate Claim Number field as mandatory field when Doc type and title already selected
	typeClaimNumber(eopClaimNumbers[1]);
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Claim Number field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	claimNumbertxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate Payee Name field as mandatory field when Doc type and title already selected
	typePayeeName('test');
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Payee Name field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	payeeNametxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate ICN field as mandatory field when Doc type and title already selected
	typeInternalControlNumber('872364');
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When ICN field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	internalControlNumbertxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate Bank Number field as mandatory field when Doc type and title already selected
	typeBankNumber('865');
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Bank Number field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	bankNumbertxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate Load date through field as mandatory field when Doc type and title already selected
	loadTotxtbox.click();
	loadTotxtbox.sendKeys('03/18/2017');
	notificationCount.click();
	expect(loadTotxtbox.getAttribute('value')).toEqual('03/18/2017');
	notificationCount.click();
	
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Load date from field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	loadTotxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate Check Number field as mandatory field when Doc type and title already selected
	typeCheckNumber('54213862');
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Check Number field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	checkNumbertxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});
	
	//Validate Provider Tax ID field as mandatory field when Doc type and title already selected
	typeProviderTaxID('123456789');
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Provider Tax ID field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});	
	providerTaxIDtxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	if(searchButton.isEnabled() == true)
	{
		console.log ('Search button is Enabled When mandatory field is not entered');
	}
	
	//Validate Load date from field as mandatory field when Doc type and title already selected
	loadFromtxtbox.click();
	loadFromtxtbox.sendKeys('02/12/2017');
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== true)
	{
		console.log('Issue - Search button is disabled When Load date field is entered for EOP');
	}
	else
	{
		expect(visiblity).toBe(true);
	}
	});
	loadFromtxtbox.clear();
	notificationCount.click();
	searchButton.isEnabled().then(function(visiblity){
	if(visiblity !== false)
	{
		console.log('Issue - Search button is Enabled When mandatory field is not entered');
	}
	else
	{
		expect(visiblity).toBe(false);
	}
	});	
  });
  
  it("TC052_Doc Search_Validate the Single or Multiple Column sort and default sort", function(){
		//Validating default sorting order for Load date when document type is selected as Medical Bills
		clearButton.click();
		selectDocumentType('Medical Bills');
		typeClaimNumber(medicalBillClaimNumbers[0]);
		clickSearchButton();
		browser.sleep(5000);
		notificationCount.click();
		
		var defaultDownArrow = element(by.xpath("//div[@id='docList']/div/div/div/div/div/div/div/div/div[3]/div/div/span/i"));
		expect(defaultDownArrow.isDisplayed()).toBe(true);
		
		//Sorting column's by selecting document type as Medical Bills
		//Sorting Claim Number column
		headerCellLabel.get(1).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 1).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 1).getText());  
			  }
		});
		
		headerCellLabel.get(1).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 1).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 1).getText());  
		  }
		});
		
		//Sorting Load Date column - issue in application level load date is not sorting properly
		headerCellLabel.get(2).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
			  rowsCount = count;
		  if(rowsCount > 10 ) {
			  rowsCount = 10;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 2).getText().then(function(date) { 
					  return datestringtoMillis(date) })).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 2).getText().then(function(date) { 
						  return datestringtoMillis(date) }));  
			  }
		});
				
		headerCellLabel.get(2).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 2).getText().then(function(date) { 
				  return datestringtoMillis(date) })).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 2).getText().then(function(date) { 
					  return datestringtoMillis(date) }));  
		  }
		});
		
		//Sorting Doc Title column
		headerCellLabel.get(3).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 3).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 3).getText());  
			  }
		});
		
		headerCellLabel.get(3).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		 .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		 }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 3).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 3).getText());  
		  }
		});

		//Sorting DCN column
		headerCellLabel.get(4).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 4).getText().then(function(text){return text.toUpperCase();})).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 4).getText().then(function(text){return text.toUpperCase();}));  
			  }
		});
		
		headerCellLabel.get(4).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		 .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		 }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 4).getText().then(function(text){return text.toUpperCase();})).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 4).getText().then(function(text){return text.toUpperCase();}));  
		  }
		});
			
		//Validating default sorting icon for Load Date column
		clearButton.click();
		selectDocumentType('EOP');
		
		//EOP Claim Number field is not working as of now so we took loadfrom and loadto dates to apply search for sorting TC"s
		typeClaimNumber(eopClaimNumbers[1]);
		notificationCount.click();
		clickSearchButton();
		browser.sleep(5000);
		notificationCount.click();
		expect(defaultDownArrow.isDisplayed()).toBe(true);	
		
		//Sorting column's based on EOP document type			
		//Sorting Claim Number column
		headerCellLabel.get(1).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 1).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 1).getText());  
			  }
		});
		
		headerCellLabel.get(1).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 1).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 1).getText());  
		  }
		});
		
		//Sorting Load date column
		headerCellLabel.get(2).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
			  rowsCount = count;
		  if(rowsCount > 10 ) {
			  rowsCount = 10;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 2).getText().then(function(date) { 
					  return datestringtoMillis(date) })).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 2).getText().then(function(date) { 
						  return datestringtoMillis(date) }));  
			  }
		});
		
		headerCellLabel.get(2).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 2).getText().then(function(date) { 
				  return datestringtoMillis(date) })).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 2).getText().then(function(date) { 
					  return datestringtoMillis(date) }));  
		  }
		});
				
		//Sorting Doc Title column
		headerCellLabel.get(3).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 3).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 3).getText());  
			  }
		});
		
		headerCellLabel.get(3).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
			  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		 .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 3).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 3).getText());  
		  }
		});
		
		//Sorting ICN column
		headerCellLabel.get(4).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 4).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 4).getText());  
			  }
		});
		
		headerCellLabel.get(4).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 4).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 4).getText());  
			  }
		});
			
		//Sorting Sequence column
		headerCellLabel.get(5).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 5).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 5).getText());  
			  }
		});
		
		headerCellLabel.get(5).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 4 ) {
			  rowsCount = 4;
		  }
			  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 5).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 5).getText());  
		  }
		});
			
		//Sorting Provider Tax ID column
		headerCellLabel.get(6).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 6).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 6).getText());  
			  }
		});
			
		headerCellLabel.get(6).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 6).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 6).getText());  
		  }
		});
			
		//Sorting Payee Name column
		headerCellLabel.get(7).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 7).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 7).getText());  
			  }
		});
		
		headerCellLabel.get(7).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		 for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 7).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 7).getText());  
		  }
		});
			
		//Sorting Bank Number column 
		headerCellLabel.get(8).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 8).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 8).getText());  
			  }
		});
		
		headerCellLabel.get(8).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		 for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 8).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 8).getText());  
		  }
		});
		
		//Sorting Check Number column
		headerCellLabel.get(9).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
			  for(var i = 0; i < rowsCount - 1; i++) {
				  expect(gridTestUtils.dataCell('docList', i + 1, 9).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 9).getText());  
			  }
		});
		
		headerCellLabel.get(9).click();
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
		  .then(function(count) {
		  rowsCount = count;
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
		  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i + 1, 9).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i, 9).getText());  
		  }
		});		
	  });
  
  //TO-DO Alison - Secure claim issue needs to be fixed later
  /*xit("TC090_Doc Search_Validate the 'View document icon' button functions", function(){
	//Validate view document icon for Medical Bills document type
	clearButton.click();
	browser.sleep(3000);
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(3000);
	expect(viewDocumentIcon.get(0).isEnabled()).toBe(true);
	
	viewDocumentIcon.get(0).click();
	browser.sleep(2000);
	browser.getAllWindowHandles().then(function(handles){
	  browser.switchTo().window(handles[1]).then(function(){
	      var URL = browser.getCurrentUrl();
	      expect(URL).toContain("https://test-exprsedm.lmig.com/rest/document/content/");		        
	  });
	  browser.driver.close();
	  browser.driver.switchTo().window(handles[0]);
	  browser.sleep(3000);
	  for(var j = 0; j<5; j++)
	  {
		  expect(gridTestUtils.dataCell('docList', 0, j).getCssValue('background-color')).toEqual('rgba(0, 38, 99, 1)');
	  }
	});
	
	//TO-DO add script to validate secure claim document
			
  });*/

  it("TC077_Doc Search_Validate the ability to view multiple documents from the search result(max limit 20)", function(){
	var rowsCount = 0;
	clearButton.click();
	selectDocumentType('EOP');
	typeClaimNumber(eopClaimNumbers[1]);
	notificationCount.click();
	
	clickSearchButton();
	browser.sleep(5000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  expect(rows.get(i).isDisplayed()).toBe(true);  
		  } 
		});
	
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 4)).click().perform();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 5, 4)).keyDown(protractor.Key.SHIFT).click().perform();		
	viewMultipleButton.click();
	
	browser.sleep(5000);
	  browser.getAllWindowHandles().then(function(handles) {
		  browser.driver.switchTo().window(handles[1]).then(function() {
			  browser.driver.wait(function() {
			    return browser.driver.getCurrentUrl().then(function(url) {
			        expect(url).toContain('https://test-edm-ui.lmig.com/#/multiviewer?useProxy=N&claimIDs');
			        return url;
			    });
			  });
			  browser.driver.close();
			  browser.driver.switchTo().window(handles[0]);
			  browser.actions().mouseMove(gridTestUtils.dataCell('docList', 5, 4)).keyUp(protractor.Key.SHIFT).click().perform();
		  });
	  });

	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 4)).click().perform();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 21, 4)).keyDown(protractor.Key.SHIFT).click().perform();
	viewMultipleButton.click();
	browser.sleep(5000);
	
 	var maxViewMultipleMsg = element(by.id('ngdialog1-aria-describedby'));
 	var expectedMaxViewMultipleMsg = "You may only select a maximum of 20 documents. You have selected more than 20 documents. Please reduce the number of your selections.";
 	expect(maxViewMultipleMsg.getText()).toEqual(expectedMaxViewMultipleMsg);
	var yesButton = element(by.id('yesBtn'));
	yesButton.click();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 4)).keyDown(protractor.Key.SHIFT).click().perform();
  });
  
  it("TC078_Doc Search_Validate the ability to print multiple documents from the search result(max limit 20)", function(){
	var rowsCount = 0;
	clearButton.click();
	selectDocumentType('EOP');
	notificationCount.click();
	loadFromtxtbox.sendKeys("04/04/2017");
	loadTotxtbox.sendKeys("04/21/2017");
	notificationCount.click();
	clickSearchButton();
	browser.sleep(6000);
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  expect(rows.get(i).isDisplayed()).toBe(true);  
		  } 
	});
	
		//TO-DO currently we are not able to select 20 documents from the search result. As of now it's selecting only visible documents from the search result
		/*browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 4)).click().perform();
		browser.actions().mouseMove(gridTestUtils.dataCell('docList', 21, 4)).keyDown(protractor.Key.SHIFT).click().perform();		
		viewMultipleButton.click();
		
		element(by.xpath("//p[text()='You may only select a maximum of 20 documents. You have selected more than 20 documents. Please reduce the number of your selections.']")).getText().then (function(text){
			expect(text).toContain("You may only select a maximum of 20 documents. You have selected more than 20 documents. Please reduce the number of your selections.");
			var yesButton = element(by.css('#yesBtn'));
			yesButton.click();
			browser.actions().mouseMove(gridTestUtils.dataCell('docList', 21, 4)).keyUp(protractor.Key.SHIFT).click().perform();
			expect(documentTypeLabel.isDisplayed()).toBe(true);
		});*/
		
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 3, 4)).click().perform();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 5, 4)).keyDown(protractor.Key.SHIFT).click().perform();	
	
	//TO-DO need to handle print dialogue window
	/*printButton.click();*/
	
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 5, 4)).keyUp(protractor.Key.SHIFT).click().perform();
	
  });
  
  it("TC084_Doc Search_Validate the filter column with multiple char's & numbers", function(){
		//Applying filter in grid column for Medical Bills document type
		clearButton.click();
		selectDocumentType('Medical Bills');
		expect(documentTypeDropdown.getAttribute('value')).toEqual(documentTypeValues[2]);
		browser.sleep(2000);
		notificationCount.click();
		typeClaimNumber(medicalBillClaimNumbers[0]);
		clickSearchButton();	
		browser.sleep(5000);
		
		//applying filter in Claim Number column
		var rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 1, medicalBillClaimNumbers[0]);
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 1, medicalBillClaimNumbers[0]);  
		  } 
		});
		notificationCount.click();
		
		//removing filter from Claim Number column
		expect(cancelGridFilter.get(0).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(0)).click().perform();
		
		//applying filter in Load Date column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 2, '03/03/2017');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 2, '03/03/2017');  
		  } 
		});
		notificationCount.click();
		
		//removing filter from Load Date column
		expect(cancelGridFilter.get(1).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(1)).click().perform();
			
		//applying filter in Doc Title column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 3, 'Original Bill Image');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Original Bill Image');  
		  } 
		});
		notificationCount.click();
		
		//removing filter from Doc Title column
		expect(cancelGridFilter.get(2).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(2)).click().perform();
		
		//Applying filter in DCN column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 4, 'Klhv9l9F1mV05v');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 4, 'Klhv9l9F1mV05v');  
		  } 
		});	
		expect(cancelGridFilter.get(3).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(3)).click().perform();
		
		//Applying filter in grid column for EOP document type
		clearButton.click();
		selectDocumentType('EOP');
		
		typeClaimNumber(eopClaimNumbers[1]);
		notificationCount.click();
		
		clickSearchButton();
		browser.sleep(5000);
		
		//Applying filter in Claim Number column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 1, 'WC823-A00002');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
			}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 1, 'WC823-A00002');  
		  } 
		});
		expect(cancelGridFilter.get(0).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(0)).click().perform();
		
		//Applying filter in Load Date column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 2, '04/28/2017');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
			rowsCount = count;
			expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 2, '04/28/2017');  
		  } 
		});
		expect(cancelGridFilter.get(1).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(1)).click().perform();
		
		//Applying filter in Doc Title column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 3, 'Denial EOP');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 3, 'Denial EOP');  
		  } 
		});	
		expect(cancelGridFilter.get(2).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(2)).click().perform();
			
		//Applying filter in ICN column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 4, '587497555888');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 4, '587497555888');  
		 } 
		});	
		expect(cancelGridFilter.get(3).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(3)).click().perform();
		
		//Applying filter in Sequence column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 5, '1');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 5, '1');  
		  } 
		});	
		expect(cancelGridFilter.get(4).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(4)).click().perform();
		
		//Applying filter in Provider Tax ID column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 6, '8153');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 6, '8153');  
		  } 
		});	
		expect(cancelGridFilter.get(5).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(5)).click().perform();
		
		//Applying filter in Payee Name column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 7, 'PAYEE NAME');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
			rowsCount = count;
			expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 7, 'PAYEE NAME');
		  } 
		});	
		expect(cancelGridFilter.get(6).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(6)).click().perform();
		
		//Applying filter in Bank Number column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 8, '288');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 8, '288');  
		  } 
		});	
		expect(cancelGridFilter.get(7).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(7)).click().perform();
		
		//Applying filter in Check Number column
		rowsCount = 0;
		gridTestUtils.enterFilterInColumn('docList', 9, '2554157');
		browser.sleep(4000);
		gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count().then(function(count) {
		  rowsCount = count;
		  expect(rowsCount).toBeGreaterThan(0);
		}).then(function() {
		  for( var i = 0; i < rowsCount; i++) {
			  gridTestUtils.expectCellValueMatch('docList', i, 9, '2554157');  
		  } 
		});	
		expect(cancelGridFilter.get(8).isDisplayed()).toBe(true);
		browser.actions().mouseMove(cancelGridFilter.get(8)).click().perform();	
	  });
  
  it("TC049_Doc Search_Validate the 'Single Click Event on Row' on the document search result", function(){
	var rowsCount = 0;
	clearButton.click();
	selectDocumentType('EOP');
	notificationCount.click();
	selectDocumentTitle('Single Checks');
	typeClaimNumber(eopClaimNumbers[1]);
	clickSearchButton();
	browser.sleep(3000);
			
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
	  .then(function(count) {
	  rowsCount = count;
	  })
	  .then(function() {
		  if(rowsCount > 0) {
			//Clicking on a row and validating all the column's are getting highlighted
			var rowLength = 10;
			gridTestUtils.click(gridTestUtils.dataCell('docList', 0, 3));
			for(var i = 0; i < rowLength; i++) {
			  expect(gridTestUtils.dataCell('docList', 0, i).getCssValue('background-color')).toEqual('rgba(0, 38, 99, 1)');  
			}
						
			//Clicking elsewhere on row should highlight
			browser.sleep(500);
			browser.actions().mouseMove(gridTestUtils.dataCell('docList', 1, 3)).click().perform();
			for(var i = 0; i < rowLength; i++) {
			  expect(gridTestUtils.dataCell('docList', 1, i).getCssValue('background-color')).toEqual('rgba(0, 38, 99, 1)');  
			}
					
			//Using control key single click on a row
		browser.sleep(500);
		gridTestUtils.click(gridTestUtils.dataCell('docList', 0, 5));
		browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 3)).keyDown(protractor.Key.CONTROL).click().perform();
		for(var i = 0; i < rowLength; i++) {
		  expect(gridTestUtils.dataCell('docList', 0, i).getCssValue('background-color')).not.toEqual('rgba(0, 38, 99, 1)');
		}
			browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 3)).keyUp(protractor.Key.CONTROL).click().perform();	 
	  }
	});
  });
  
//TO-DO Alison - Secure claim issue needs to be fixed later
  /*xit("TC050_Doc Search_Validate the 'Double Click Event on Row' on the document search result", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(5000);
	
	//TO-DO need to fix double click functionality
	browser.actions().doubleClick(gridTestUtils.dataCell('docList', 1, 2)).perform();
	var rowLength = 5;
	browser.sleep(5000);
	  browser.getAllWindowHandles().then(function(handles) {
		  browser.driver.switchTo().window(handles[1]).then(function() {
			  browser.driver.wait(function() {
			    return browser.driver.getCurrentUrl().then(function(url) {
			        expect(url).toContain('https://test-exprsedm.lmig.com/rest/document/content/');
			        return url;
			    });
			  });
			  browser.driver.close();
			  browser.driver.switchTo().window(handles[0]);
			  for(var i = 0; i < rowLength; i++) {
				  expect(gridTestUtils.dataCell('docList', 1, i).getCssValue('background-color')).toEqual('rgba(0, 38, 99, 1)');  
				}
		  });
	  });
	  
	//TO-DO add script to validate secure claim document
		
  });*/
  
  it("TC051_Doc Search_Validate the 'Right click event and Default Highlight' on the document search result", function(){
	var rowsCount = 0;
	clearButton.click();
	selectDocumentType('EOP');
	typeClaimNumber(eopClaimNumbers[1]);
	searchButton.click();
	browser.sleep(5000);
	
	gridTestUtils.getGrid( 'docList' ).element( by.css('.ui-grid-render-container-body')).all( by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index') ).count()
	  .then(function(count) {
	  rowsCount = count;
	  })
	  .then(function() {
		  if(rowsCount > 0) {
			//Right clicking on element should highlight an row
			gridTestUtils.click(gridTestUtils.dataCell('docList', 0, 5));
			browser.actions().click(protractor.Button.RIGHT).perform();
			var rowLength = 10;
			for(var i = 0; i < rowLength; i++) {
			  expect(gridTestUtils.dataCell('docList', 0, i).getCssValue('background-color')).toEqual('rgba(0, 38, 99, 1)');  
			}
		  }
	  });
	});
	  
  it("TC067_Doc Search_Validate the functions of 'Search' button", function(){
	//Validating visibility of Search button for Medical Bills document type
	clearButton.click();
	selectDocumentType('Medical Bills');
		
	typeClaimNumber(medicalBillClaimNumbers[0]);
	expect(searchButton.isEnabled()).toBe(true);
	claimNumbertxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	documentControlNumbertxtbox.click();
	documentControlNumbertxtbox.sendKeys("1234");
	expect(searchButton.isEnabled()).toBe(true);
	documentControlNumbertxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	//Validating visibility of Search button for EOP document type
	clearButton.click();
	selectDocumentType('EOP');
	
	typeClaimNumber(eopClaimNumbers[1]);
	expect(searchButton.isEnabled()).toBe(true);
	claimNumbertxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	internalControlNumbertxtbox.sendKeys("8792354");
	expect(searchButton.isEnabled()).toBe(true);
	internalControlNumbertxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	payeeNametxtbox.sendKeys("test");
	expect(searchButton.isEnabled()).toBe(true);
	payeeNametxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	providerTaxIDtxtbox.sendKeys("1234567890");
	expect(searchButton.isEnabled()).toBe(true);
	providerTaxIDtxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	bankNumbertxtbox.sendKeys("8765");
	expect(searchButton.isEnabled()).toBe(true);
	bankNumbertxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	checkNumbertxtbox.sendKeys("54254");
	expect(searchButton.isEnabled()).toBe(true);
	checkNumbertxtbox.clear();
	expect(searchButton.isEnabled()).toBe(false);
	
	loadFromtxtbox.sendKeys("01/23/2017");
	loadTotxtbox.sendKeys("03/01/2017");
	notificationCount.click();
	expect(searchButton.isEnabled()).toBe(true);
	loadTotxtbox.clear();
	loadFromtxtbox.clear();
	notificationCount.click();
	expect(searchButton.isEnabled()).toBe(false);
		
	expect(browser.getTitle()).toEqual("ExPRS Search");
	
	clearButton.click();
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	
	browser.actions().mouseMove(searchButton).perform();
	browser.sleep(5000);
	var tooltip = element(by.xpath("//div[@class='col-md-6'][2]/label"));
	expect(tooltip.getAttribute('uib-tooltip')).toContain("User must enter Document Type, Document Title and at least ONE other criteria field. Search will return up to the 1st 500 documents that match the search criteria. Use the Show More button to see additional items.");
	browser.sleep(2000);
	notificationCount.click();
  });
	  
  //TO-DO Alison - Secure claim issue needs to be fixed later
 /*xit("TC070_Doc Search_Validate the 'View Multiple' button functions", function(){
	notificationCount.click();
	clearButton.click();
	selectDocumentType('Medical Bills');
	//selectDocumentTitle('Appeal');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(5000);
	
	expect(viewMultipleButton.isEnabled()).toBe(false);
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 1, 4)).click().perform();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 3, 4)).keyDown(protractor.Key.SHIFT).click().perform();
	
	viewMultipleButton.click();
	
	browser.sleep(5000);
	  browser.getAllWindowHandles().then(function(handles) {
		  browser.driver.switchTo().window(handles[1]).then(function() {
			  browser.driver.wait(function() {
			    return browser.driver.getCurrentUrl().then(function(url) {
			        expect(url).toContain('https://test-edm-ui.lmig.com/#/multiviewer?useProxy=N&claimIDs');
			        return url;
			    });
			  });
		  browser.driver.close();
			  browser.driver.switchTo().window(handles[0]);
			  browser.actions().mouseMove(gridTestUtils.dataCell('docList', 3, 4)).keyUp(protractor.Key.SHIFT).click().perform();
		  });
	});
	  
	 //TO-DO add test script to validate alert message for user is not authorized and secure claim
	 
	 expect(browser.getTitle()).toEqual("ExPRS Search");	
  });*/
	
  //TO-DO Alison - Secure claim issue needs to be fixed later
  /*xit("TC071_Doc Search_Validate the 'Export' button functions", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(5000);
	
	expect(exportButton.isEnabled()).toBe(true);
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 2)).click().perform();
	exportButton.click();
	browser.sleep(3000);
	var exportNoButton = element(by.css('#noBtn'));
	var exportYesButton = element(by.css('#yesBtn'));
	exportYesButton.click();
	browser.sleep(4000);
	
	//TO-DO add test script to validate alert message for user is not authorized and secure claim
	
	expect(browser.getTitle()).toEqual("ExPRS Search");
	claimNumbertxtbox.clear();
	expect(claimNumbertxtbox.getAttribute('placeholder')).toEqual('WC___-______');	
  });*/
  
  //TO-DO Alison - Secure claim issue needs to be fixed later
  /*xit("TC090_Doc Search_Validate the 'Print' button functions",function(){
	clearButton.click();
	selectDocumentType('EOP');
	typeClaimNumber(eopClaimNumbers[1]);
	clickSearchButton();
	browser.sleep(5000);
	
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 1, 2)).click().perform();
	printButton.click();
	browser.sleep(4000);
		
	var actualPrintAlert = element(by.xpath("//p[contains(text(),'Sending 1 document to be printed.')]"));
	var expectedPrintAlert = "Sending 1 document to be printed.";
	expect(actualPrintAlert.getText()).toEqual(expectedPrintAlert);
	var printOkButton = element(by.id('okBtn'));
	var printCancelButton = element(by.id('cancelBtn'));
	printCancelButton.click();
	browser.sleep(5000);
	
	//TO-DO add test script to validate alert message for user is not authorized and secure claim
	
	expect(browser.getTitle()).toEqual("ExPRS Search");
	claimNumbertxtbox.clear();
	expect(claimNumbertxtbox.getAttribute('placeholder')).toEqual('WC___-______');
  });*/
	 
  //TO-DO Since we are not able to handle Print List window so we marked it as pending
  xit("TC090_Doc Search_Validate the 'Print List' button functions",function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(5000);
	
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 2)).click().perform();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 2, 2)).keyDown(protractor.Key.SHIFT).click().perform();
	
	//Not able to handle print window
	printListButton.click();
	
	//we are Not able to handle print list window
	browser.getAllWindowHandles().then(function(handles) {
		  browser.driver.switchTo().window(handles[1]).then(function() {
			  browser.driver.wait(function() {
			    var printCancelbutton = element(by.xpath("//button[text()='Cancel']"));
			    printCancelbutton.click();
				    });
			  });
		  browser.driver.close();
		  browser.driver.switchTo().window(handles[0]);
	});
  });
  
  it("TC025_Doc Search_Validate the 'Claim Number' field attributes in search area", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	notificationCount.click();
	selectDocumentTitle('Appeal');
	
	expect(claimNumbertxtbox.isEnabled()).toBe(true);
	claimNumbertxtbox.clear();
	//removing DCN Number by giving BACKSPACE
	claimNumbertxtbox.sendKeys(medicalBillClaimNumbers[0]).then(function() {
		claimNumbertxtbox.sendKeys(protractor.Key.BACK_SPACE).then(function() {
			browser.sleep(2000);
	           expect(claimNumbertxtbox.getAttribute('value')).toEqual("WC823-A2966");
	    });
	});
	 
	claimNumbertxtbox.clear();
	
	//Unable to validate claim textbox field length
	expect(claimNumbertxtbox.getAttribute('placeholder')).toEqual('WC___-______');
	 
	//copy and paste
	documentControlNumbertxtbox.clear();
	documentControlNumbertxtbox.sendKeys(medicalBillClaimNumbers[0]);
	documentControlNumbertxtbox.sendKeys(protractor.Key.CONTROL, "a");
	documentControlNumbertxtbox.sendKeys(protractor.Key.CONTROL, "x");
	expect(documentControlNumbertxtbox.getAttribute('value')).toEqual('');
	claimNumbertxtbox.click();
	claimNumbertxtbox.sendKeys(protractor.Key.CONTROL, "v");
	browser.actions().sendKeys(protractor.Key.NULL).perform();
	browser.sleep(2000);
	expect(claimNumbertxtbox.getAttribute('value')).toEqual(medicalBillClaimNumbers[0]);
	  
	//hover text for claim number text box field is not displayed in application
	claimNumbertxtbox.click();
	claimNumbertxtbox.clear();
	claimNumbertxtbox.sendKeys("WC116-A0239")
	searchButton.click();
	  
	expect(errorMessageLabel.get(1).isDisplayed()).toBe(true);
	var expectedresult = "Claim number format must be WCXXX-XXXXXX";
	expect(errorMessageLabel.get(1).getText()).toEqual(expectedresult);
  });
  
  it("TC027_Doc Search_Validate the 'Document Control Number (DCN)'  field is disabled", function(){
	clearButton.click();
	browser.sleep(500);
	deSelectDocumentType();
	//Not able to de-select document title
	
	//Validating DCN field for Medical Bills document type
	expect(documentControlNumbertxtbox.isEnabled()).toBe(false);	
  });
  
  it("TC032_Doc Search_Validate the 'Internal Control Number (ICN)'  field is disabled", function(){
	clearButton.click();
	browser.sleep(500);
	selectDocumentType('EOP');
	browser.sleep(500);
	deSelectDocumentType();
	//Validating ICN field for EOP document type
	expect(internalControlNumbertxtbox.isEnabled()).toBe(false);	
  });
  
  it("TC034_Doc Search_Validate the 'Internal Control Number (ICN)' field attributes in search area", function(){
	clearButton.click();
	browser.sleep(5000);
	
	selectDocumentType('EOP');
	
	selectDocumentTitle('Single Checks');
	expect(internalControlNumbertxtbox.isEnabled()).toBe(true);
	//removing DCN Number by giving BACKSPACE
	claimNumbertxtbox.sendKeys(eopClaimNumbers[1]).then(function() {
		claimNumbertxtbox.sendKeys(protractor.Key.BACK_SPACE).then(function() {
			browser.sleep(2000);
	           expect(claimNumbertxtbox.getAttribute('value')).toEqual('WC823-A0000');
	    });
	});
	
	claimNumbertxtbox.clear();
	
	internalControlNumbertxtbox.clear();
	internalControlNumbertxtbox.sendKeys("1100002558");
	internalControlNumbertxtbox.sendKeys(protractor.Key.CONTROL, "a");
	internalControlNumbertxtbox.sendKeys(protractor.Key.CONTROL, "x");
	expect(internalControlNumbertxtbox.getAttribute('value')).toEqual('');
	payeeNametxtbox.click();
	payeeNametxtbox.sendKeys(protractor.Key.CONTROL, "v");
	browser.actions().sendKeys(protractor.Key.NULL).perform();
	browser.sleep(2000);
	expect(payeeNametxtbox.getAttribute('value')).toEqual("1100002558");	
  });
  
  it("TC079_Doc Search_Validate the ability to export multiple documents from the search result(max limit 20)", function(){
	clearButton.click();
	browser.sleep(500);
	selectDocumentType('Medical Bills');
	 
	typeClaimNumber(medicalBillClaimNumbers[0]);
	clickSearchButton();
	browser.sleep(3000);
		 
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 0, 2)).click().perform();
	browser.actions().mouseMove(gridTestUtils.dataCell('docList', 8, 2)).keyDown(protractor.Key.SHIFT).click().perform();
		
	exportButton.click();
	var exportYesButton = element(by.css('#yesBtn'));
	browser.sleep(3000);
	exportYesButton.click();
	browser.sleep(5000);
	browser.getAllWindowHandles().then(function(handles) {
	  browser.driver.switchTo().window(handles[1]).then(function() {			  
			  browser.driver.close();				  
	  });
	  browser.driver.switchTo().window(handles[0]);
	  browser.actions().mouseMove(gridTestUtils.dataCell('docList', 8, 2)).keyUp(protractor.Key.SHIFT).click().perform();
    });
  });
	  
  it("TC085_Doc Search_Validate the Warning message when there is no values", function(){
	clearButton.click();
	browser.sleep(500);
	selectDocumentType('EOP');
	typeClaimNumber('WC123-A87263');
	clickSearchButton();
	browser.sleep(3000);
	expect(notificationCount.getText()).toContain('Your search returned 0 of 0 total documents found');
  });
  
  it("TC088_Doc Search_Validate the ability to view the first 500 documents", function(){
	clearButton.click();
	browser.sleep(1000);
	selectDocumentType('Medical Bills');
	typeClaimNumber(medicalBills500Documents[0]);
	
	searchButton.click();
	loadIcon.isDisplayed().then(function(visiblity){
		if(visiblity !== true)
		{
			browser.sleep(10000);
			//For 500 documents we can't verify the searched claim number having 500 documents so i took notification count to verify 
			expect(notificationCount.getText()).toEqual("Your search returned 500 of 500 total documents found");
		}
		else
		{
			console.log('Taking more time to load documents on the grid');
		}
		});		
  });
	  
  it("TC069_Doc Search_Validate the 'Show More' button functions", function(){
	clearButton.click();
	selectDocumentType('Medical Bills');
	notificationCount.click();
	//Validating Show More button when document size is more than 500 documents
	typeClaimNumber(medicalBillsMoreThan500Documents[0]);
	searchButton.click();		
	browser.sleep(10000);
	showMoreButton.isEnabled().then(function(visiblity){
		if(visiblity !== true)
		{
			console.log('Show More button is disabled When Claim Number having more than 500 documents');
		}
		else
		{
			expect(visiblity).toBe(true);
			expect(showMoreButton.isDisplayed()).toBe(true);
		}
	}); 
		
	//Validating Show More button tool tip
	browser.actions().mouseMove(showMoreButton).perform();
	browser.sleep(2000);
	expect(showMoreButton.getAttribute('uib-tooltip')).toContain("Selecting the Show More button will return all documents based on your current view/criteria. You must select the Claim Documents /MBR Documents /Inactive Documents to return ALL documents");
	
	//Validating Show More button when document size is lesser then 500 documents
	typeClaimNumber(medicalBillsLessThan500Documents[0]);
	searchButton.click();
	browser.sleep(10000);
	
	loadIcon.isDisplayed().then(function(visiblity){
		if(visiblity !== true)
		{
			expect(showMoreButton.isDisplayed()).toBe(false);
		}
		else
		{
			console.log('Taking more time to load documents on the grid');
		}
	});	
  }); 
  
  
}); //describe block 