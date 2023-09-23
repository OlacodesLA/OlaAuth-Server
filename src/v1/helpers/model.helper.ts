import Logger from "../libs/logger";

class Services {
  model: any;
  constructor(Model: any) {
    this.model = Model;
  }

  async create(data: object) {
    try {
      const newData = new this.model(data);
      return await newData.save();
    } catch (error: any) {
      Logger.error(error.message);
      throw new Error(
        `Error getting data from ${this.model} by id:${data}, ${error.message}`
      );
    }
  }

  async getById(id: string) {
    try {
      return this.model.findById(id).lean();
    } catch (error: any) {
      throw new Error(
        `Error getting data from ${this.model} by id:${id}, ${error.message}`
      );
    }
  }

  async getOne(data: object) {
    try {
      return this.model.findOne(data).lean();
    } catch (error: any) {
      throw new Error(
        `Error getting data from ${this.model} by id:${data}, ${error.message}`
      );
    }
  }

  async getByQuery(query: object = {}) {
    try {
      console.log(`this is the query: ${query}`);
      return await this.model.find(query).lean();
    } catch (error: any) {
      throw new Error(
        `Error getting data from ${this.model} by id:${query}, ${error.message}`
      );
    }
  }

  async update(id: string, data: object) {
    try {
      return await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
    } catch (error: any) {
      throw new Error(`Error updating ${this.model}: ${error.message}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error: any) {
      throw new Error(`Error deleting ${this.model}: ${error.message}`);
    }
  }

  async getOneAndUpdate(one: object, data: object) {
    try {
      return await this.model.findOneAndUpdate(
        one,
        { $set: data },
        {
          new: true,
        }
      );
    } catch (error: any) {
      throw new Error(`Error updating one ${this.model}: ${error.message}`);
    }
  }
}

export default Services;
