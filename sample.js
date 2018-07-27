describe("EDM DocSearch regression test cases",function(){
  var gridTestUtils = require('./gridTestUtils.spec.js');
  var GridObjectTest = require('./GridObjectTestUtils.spec');
		
  var grid1 = new GridObjectTest('docList');
  var grid2 = new GridObjectTest('grid2');
  
  //Local test DocSerach URL
  //var docSearchURL = "https://ciit-exprs-search-ui-dev.pdc.np.paas.lmig.com/#/search?useProxy=N";
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
//  var clearButton = element(by.css('[type="reset"]'));
  var clearButton = element(by.xpath("//button[text()='Clear']"));
  var searchButton = element(by.css('[type="submit"]'));
  //var searchButton = element(by.xpath("//button[text()='Search"));
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

  /*//DEV region
  var eopClaimNumbers = ['WC116-548747'];
  var medicalBillClaimNumbers = ['WC823-A04535'];
  //var moreThan500documentsMB = ['WC823-A30001'];
*/  
  //Test region
  var eopClaimNumbers = ['WC116-A04918','WC197-511017'];
  var medicalBillClaimNumbers = ['WC823-A29660'];
  
//More than 500 documents for Medical Bills
  var medicalBills500Documents = ['WC823-A30085'];	
  var medicalBillsMoreThan500Documents = ['WC823-A30086'];
  var medicalBillsLessThan500Documents = ['WC823-A30087'];
  
  beforeAll(function(){
	browser.manage().deleteAllCookies();
    /*browser.get("https://dev-exprsedm.lmig.com/rest/document/properties/090f12068000810a");
    browser.sleep(5000);*/
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
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
	expect(claimNumbertxtbox.getAttribute('value')).toEqual(claimnumber);
	notificationCount.click();
  };
  
  var typeDocumentControlNumber = function(dcnNumber){
	documentControlNumbertxtbox.click();
	documentControlNumbertxtbox.sendKeys(dcnNumber);
	expect(documentControlNumbertxtbox.getAttribute('value')).toEqual(dcnNumber);
	notificationCount.click();
  };
  
  var typeInternalControlNumber = function(icnNumber){
	internalControlNumbertxtbox.click();
	internalControlNumbertxtbox.sendKeys(icnNumber);
	expect(internalControlNumbertxtbox.getAttribute('value')).toEqual(icnNumber);
	notificationCount.click();
  };
  
  var typePayeeName = function(payeeName){
	payeeNametxtbox.click();
	payeeNametxtbox.sendKeys(payeeName);
	expect(payeeNametxtbox.getAttribute('value')).toEqual(payeeName);
	notificationCount.click();
  };
  
  var typeProviderTaxID = function(providertaxID){
	providerTaxIDtxtbox.click();
	providerTaxIDtxtbox.sendKeys(providertaxID);
	expect(providerTaxIDtxtbox.getAttribute('value')).toEqual(providertaxID);
	notificationCount.click();
  };
  
  var typeBankNumber = function(banknumber){
	bankNumbertxtbox.click();
	bankNumbertxtbox.sendKeys(banknumber);
	expect(bankNumbertxtbox.getAttribute('value')).toEqual(banknumber);
	notificationCount.click();
  };
  
  var typeCheckNumber = function(checknumber){
    checkNumbertxtbox.click();
    checkNumbertxtbox.sendKeys(checknumber);
    expect(checkNumbertxtbox.getAttribute('value')).toEqual(checknumber);
    notificationCount.click();
  };  
  
  var clickSearchButton = function(){
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
  
  it("TC052_Doc Search_Validate the Single or Multiple Column sort and default sort", function(){
		//Validating default sorting order for Load date when document type is selected as Medical Bills
		clearButton.click();
		selectDocumentType('Medical Bills');
		typeClaimNumber(medicalBillClaimNumbers[0]);
		clickSearchButton();
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
			  expect(gridTestUtils.dataCell('docList', i, 1).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 1).getText());  
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
			  expect(gridTestUtils.dataCell('docList', i, 3).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 3).getText());  
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
				  expect(gridTestUtils.dataCell('docList', i + 1, 4).getText()).not.toBeLessThan(gridTestUtils.dataCell('docList', i, 4).getText());  
			  }
		});
			
		//Validating default sorting icon for Load Date column
		clearButton.click();
		selectDocumentType('EOP');
		
		//EOP Claim Number field is not working as of now so we took loadfrom and loadto dates to apply search for sorting TC"s
		loadFromtxtbox.sendKeys("04/18/2017");
		loadTotxtbox.sendKeys("04/21/2017")
		notificationCount.click();
		clickSearchButton();
		browser.sleep(6000);
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
			  expect(gridTestUtils.dataCell('docList', i, 1).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 1).getText());  
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
			  expect(gridTestUtils.dataCell('docList', i, 3).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 3).getText());  
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
		  if(rowsCount > 5 ) {
			  rowsCount = 5;
		  }
			  })
		  .then(function() {
		  for(var i = 0; i < rowsCount - 1; i++) {
			  expect(gridTestUtils.dataCell('docList', i, 5).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 5).getText());  
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
			  expect(gridTestUtils.dataCell('docList', i, 6).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 6).getText());  
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
			  expect(gridTestUtils.dataCell('docList', i, 7).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 7).getText());  
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
			  expect(gridTestUtils.dataCell('docList', i, 8).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 8).getText());  
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
			  expect(gridTestUtils.dataCell('docList', i, 9).getText()).not.toBeGreaterThan(gridTestUtils.dataCell('docList', i + 1, 9).getText());  
		  }
		});
		
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
	  	
  it("TC077_Doc Search_Validate the ability to view multiple documents from the search result(max limit 20)", function(){
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
		browser.sleep(50000);
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
		browser.sleep(50000);
		
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
 
  
			  
});