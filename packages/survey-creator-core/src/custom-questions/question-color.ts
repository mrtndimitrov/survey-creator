import { QuestionFactory, QuestionTextModel, Serializer, property } from "survey-core";

export class QuestionColorModel extends QuestionTextModel {
  @property() public unit: string;

  private getCorrectedValue(newValue: string): string {
    newValue = newValue ?? "";
    newValue = (newValue.match(/#(\d|\w){1,6}/) || ["#000000"])[0];
    if(newValue.length === 4) {
      for(let i = 1; i < 4; i++) {
        newValue += newValue[i];
      }
    }
    if(newValue.length < 7) {
      const length = newValue.length;
      for(let i: number = 0; i < 7 - length; i++) {
        newValue += "0";
      }
    }
    return newValue;
  }
  protected setNewValue(newValue: string): void {
    this.resetRenderedValue();
    super.setNewValue(this.getCorrectedValue(newValue));
    this.updateRenderedValue();
  }
  public onBeforeInput(event: InputEvent): void {
    if(!!event.data && !/[\d\w#]/.test(event.data)) {
      event.preventDefault();
    }
  }
  public onColorInputChange(event: Event): void {
    this.value = (<any>event.target).value;
  }
  public getType(): string {
    return "color";
  }
  @property({}) _renderedValue: string;
  private resetRenderedValue(): void {
    this._renderedValue = undefined;
  }
  private updateRenderedValue(): void {
    this._renderedValue = this.value;
  }
  public get renderedValue(): string {
    return (this._renderedValue ?? this.value ?? "#000000").toUpperCase();
  }
  public getSwatchStyle(): {[index: string]: string} {
    return { backgroundColor: this.renderedValue };
  }
  public get isInputTextUpdate(): boolean {
    return false;
  }
  public onSurveyValueChanged(newValue: any): void {
    super.onSurveyValueChanged(newValue);
    this.updateRenderedValue();
  }

}
Serializer.addClass("color", [
  "unit"
], () => new QuestionColorModel(""), "text");

QuestionFactory.Instance.registerQuestion("color", name => {
  return new QuestionColorModel(name);
});